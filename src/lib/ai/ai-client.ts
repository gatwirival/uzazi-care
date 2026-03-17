/**
 * AI client integration
 * Handles interaction with the configured OpenAI-compatible provider for medical analysis
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();
const OPENAI_BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com').replace(/\/$/, '');

function isGitHubModelsEndpoint(): boolean {
  return OPENAI_BASE_URL.includes('models.github.ai') || OPENAI_BASE_URL.includes('models.inference.ai.azure.com');
}

export function isLLMConfigured(): boolean {
  return !!OPENAI_API_KEY;
}

function getOpenAIEndpoint(): string {
  if (process.env.OPENAI_API_URL) {
    return process.env.OPENAI_API_URL.trim();
  }

  if (isGitHubModelsEndpoint()) {
    return 'https://models.github.ai/inference/chat/completions';
  }

  return `${OPENAI_BASE_URL}/v1/chat/completions`;
}

function getRequestHeaders(stream: boolean): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    ...(stream ? { Accept: 'text/event-stream' } : {}),
  };

  if (isGitHubModelsEndpoint()) {
    headers.Accept = stream ? 'text/event-stream' : 'application/vnd.github+json';
    headers['X-GitHub-Api-Version'] = '2026-03-10';
  }

  return headers;
}

function normalizeModel(model: string): string {
  if (!isGitHubModelsEndpoint()) {
    return model;
  }

  if (model.includes('/')) {
    return model;
  }

  return `openai/${model}`;
}

async function requestChatCompletion(
  payload: Record<string, unknown>,
  stream: boolean
): Promise<Response> {
  const response = await fetch(getOpenAIEndpoint(), {
    method: 'POST',
    headers: getRequestHeaders(stream),
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return response;
  }

  let errorMessage = response.statusText;
  try {
    const errorData = await response.json();
    errorMessage = errorData.error?.message || errorData.message || JSON.stringify(errorData);
  } catch {
    // keep status text
  }

  throw new Error(`OpenAI API error: ${errorMessage}`);
}

function getDefaultModel(): string {
  if (isGitHubModelsEndpoint()) {
    return process.env.OPENAI_MODEL || 'openai/gpt-4o-mini';
  }

  return process.env.OPENAI_MODEL || 'gpt-4o-mini';
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }[];
}

/**
 * Send a chat completion request to the configured AI provider
 */
export async function sendChatCompletion(
  messages: ChatMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  }
): Promise<ChatCompletionResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const response = await requestChatCompletion(
    {
      model: normalizeModel(options?.model || getDefaultModel()),
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000,
      stream: options?.stream ?? false,
    },
    false
  );

  return response.json();
}

/**
 * Stream chat completion from the configured AI provider
 */
export async function streamChatCompletion(
  messages: ChatMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<ReadableStream> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const response = await requestChatCompletion(
    {
      model: normalizeModel(options?.model || getDefaultModel()),
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000,
      stream: true,
    },
    true
  );

  if (!response.body) {
    throw new Error('Response body is null');
  }

  return response.body;
}

/**
 * Analyze patient data with AI
 */
export async function analyzePatientData(
  patientData: {
    name: string;
    age?: number;
    gender?: string;
    medicalHistory?: string;
    currentSymptoms?: string;
    labResults?: any;
    medications?: string[];
  },
  query: string,
  agentType: 'diabetic' | 'general' = 'general'
): Promise<string> {
  const systemPrompt = getSystemPrompt(agentType);

  const patientContext = formatPatientContext(patientData);

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `${patientContext}\n\nQuestion: ${query}` },
  ];

  const response = await sendChatCompletion(messages, {
    temperature: 0.3,
    maxTokens: 3000,
  });

  return response.choices[0]?.message?.content || 'No response generated';
}

function getSystemPrompt(agentType: 'diabetic' | 'general'): string {
  if (agentType === 'diabetic') {
    return 'You are a specialized diabetes doctor assistant.';
  }

  return 'You are a general medical doctor assistant.';
}

function formatPatientContext(patientData: any): string {
  let context = 'Patient Information:\n';
  context += `- Name: ${patientData.name}\n`;

  if (patientData.age) {
    context += `- Age: ${patientData.age} years\n`;
  }

  if (patientData.gender) {
    context += `- Gender: ${patientData.gender}\n`;
  }

  if (patientData.medicalHistory) {
    context += `\nMedical History:\n${patientData.medicalHistory}\n`;
  }

  if (patientData.currentSymptoms) {
    context += `\nCurrent Symptoms:\n${patientData.currentSymptoms}\n`;
  }

  if (patientData.labResults) {
    context += `\nLab Results:\n${JSON.stringify(patientData.labResults, null, 2)}\n`;
  }

  if (patientData.medications && patientData.medications.length > 0) {
    context += `\nCurrent Medications:\n${patientData.medications.join(', ')}\n`;
  }

  return context;
}