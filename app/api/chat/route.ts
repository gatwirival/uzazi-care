import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { streamChatCompletion, ChatMessage } from '@/lib/ai/deepseek';
import { getAgent, formatPatientContextForAgent, AgentType } from '@/lib/ai/agents';
import { prisma } from '@/lib/db';
import { suggestAgent, getAgentKnowledge } from '@/lib/services/agent-routing';

// Note: Using Node runtime (not edge) because we need Prisma database access

/**
 * POST /api/chat - Stream chat responses from AI doctor agents
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      messages, 
      agentId = 'general-doctor',
      patientId,
      includePatientContext = false,
      files = []
    } = body;

    console.log('📥 RECEIVED REQUEST:');
    console.log('Messages:', JSON.stringify(messages, null, 2));
    console.log('Files count:', files.length);
    console.log('Files:', files.map((f: any) => ({ name: f.name, type: f.type, hasContent: !!f.content })));

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Get the selected agent
    const agent = getAgent(agentId as AgentType);

    // Analyze first message for agent suggestion (if using general-doctor)
    let agentSuggestion = null;
    if (agentId === 'general-doctor' && messages.length > 0) {
      const userMessage = messages[messages.length - 1];
      if (userMessage.role === 'user') {
        agentSuggestion = await suggestAgent(userMessage.content, patientId);
      }
    }

    // Build the messages array with system prompt
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: agent.systemPrompt },
    ];

    // Add doctor's fine-tuned knowledge for this agent
    const customKnowledge = await getAgentKnowledge(session.user.id, agentId);
    if (customKnowledge.length > 0) {
      chatMessages.push({
        role: 'system',
        content: `DOCTOR'S CUSTOM KNOWLEDGE BASE:\n\n${customKnowledge.join('\n\n---\n\n')}\n\nUse this knowledge to provide more personalized and specialized care.`,
      });
    }

    // If patient context is requested and patientId is provided, fetch patient data
    if (includePatientContext && patientId) {
      try {
        const patient = await prisma.patient.findFirst({
          where: {
            id: patientId,
            doctorId: session.user.id,
          },
          include: {
            File: {
              orderBy: { createdAt: 'desc' },
              take: 1, // Get most recent file for lab results
            },
          },
        });

        if (patient) {
          // Calculate age from date of birth
          let age: number | undefined;
          if (patient.dateOfBirth) {
            const dob = new Date(patient.dateOfBirth);
            age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
          }

          // Extract lab results from most recent file metadata if available
          const latestFile = patient.File[0];
          let labResults: any = null;
          let vitals: any = null;

          if (latestFile?.metadata && typeof latestFile.metadata === 'object') {
            const metadata = latestFile.metadata as any;
            
            // Try to extract lab results and vitals from metadata
            if (metadata.summary) {
              labResults = {
                hba1c: metadata.summary.averageHbA1c,
                fastingBloodGlucose: metadata.summary.averageFastingGlucose,
              };
            }
          }

          const patientContext = formatPatientContextForAgent({
            name: patient.name,
            age,
            gender: patient.gender || undefined,
            dateOfBirth: patient.dateOfBirth?.toISOString(),
            notes: patient.notes || undefined,
            labResults,
            vitals,
          });

          // Add patient context as a system message
          chatMessages.push({
            role: 'system',
            content: `PATIENT CONTEXT:\n${patientContext}`,
          });
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
        // Continue without patient context
      }
    }

    // Process uploaded files BEFORE adding messages
    let csvContext = '';
    if (files && files.length > 0) {
      for (const file of files) {
        if (file.type === 'csv' && file.content) {
          // CSV files - format for analysis
          csvContext += `\n\n📊 UPLOADED FILE: ${file.name}\n`;
          csvContext += `${'='.repeat(80)}\n`;
          
          // Parse CSV
          const rows = file.content.split('\n').filter((row: string) => row.trim());
          const headers = rows[0]?.split(',') || [];
          
          csvContext += `\nCSV COLUMNS: ${headers.join(', ')}\n`;
          csvContext += `TOTAL RECORDS: ${rows.length - 1}\n\n`;
          
          // Include full CSV data (limit to 200 rows for safety)
          const dataRows = rows.slice(0, 201); // header + 200 data rows
          csvContext += `CSV DATA:\n${dataRows.join('\n')}\n`;
          
          csvContext += `${'='.repeat(80)}\n`;
        }
      }
    }

    // Build final user message with CSV data
    const userMessages = [...messages];
    if (csvContext && userMessages.length > 0) {
      const lastUserMsgIndex = userMessages.length - 1;
      const originalQuestion = userMessages[lastUserMsgIndex].content;
      
      // Put question FIRST, then data
      userMessages[lastUserMsgIndex] = {
        ...userMessages[lastUserMsgIndex],
        content: `${originalQuestion}${csvContext}\n\nBased on the CSV medical data above, please provide a detailed answer to my question.`
      };
    }
    
    chatMessages.push(...userMessages);

    // Stream the response
    let stream;
    try {
      stream = await streamChatCompletion(chatMessages, {
        temperature: agentId === 'diabetic-doctor' ? 0.3 : 0.5,
        maxTokens: 3000,
      });
    } catch (error) {
      // If streaming fails, create an error stream
      const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
      console.error('Streaming error:', errorMessage);
      
      stream = new ReadableStream({
        start(controller) {
          const errorChunk = `data: ${JSON.stringify({
            type: 'error',
            error: errorMessage
          })}\n\n`;
          controller.enqueue(new TextEncoder().encode(errorChunk));
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();
        }
      });
    }

    // Create a TransformStream to process the SSE data
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Send agent suggestion first if available
    let agentSuggestionSent = false;

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        // Send agent suggestion before first content chunk
        if (!agentSuggestionSent && agentSuggestion) {
          const suggestionData = {
            type: 'agent_suggestion',
            suggestion: agentSuggestion,
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(suggestionData)}\n\n`)
          );
          agentSuggestionSent = true;
        }

        const text = decoder.decode(chunk);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              // Forward the chunk as-is
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(parsed)}\n\n`));
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      },
    });

    return new Response(stream.pipeThrough(transformStream), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat - Get available agents
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { getAllAgents } = await import('@/lib/ai/agents');
    const agents = getAllAgents();

    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Get agents error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
