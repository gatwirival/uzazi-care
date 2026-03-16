# AI Doctor Assistant - Implementation Guide

## 🎯 Overview

A comprehensive AI-powered medical assistant system using **DeepSeek** AI, featuring specialized doctor agents for diabetes care and general medicine.

## ✨ Features Implemented

### 1. **AI Integration (`lib/ai/deepseek.ts`)**
- DeepSeek API integration with streaming support
- Configurable temperature and token limits
- Error handling and response validation
- Patient data analysis capabilities

### 2. **Doctor Agent System (`lib/ai/agents.ts`)**

#### **Diabetic Doctor Agent** 🩺
Specialized endocrinologist with 20+ years expertise in:
- **Analysis**: HbA1c interpretation, glucose pattern analysis
- **Treatment**: Insulin therapy planning, medication management
- **Complications**: Retinopathy, nephropathy, neuropathy screening
- **Lifestyle**: Diet, exercise, weight management counseling
- **Guidelines**: ADA Standards of Care, IDF guidelines
- **Medications**: Metformin, SGLT2i, GLP-1 agonists, insulin

**Key Capabilities:**
- Blood glucose and HbA1c interpretation
- Insulin regimen optimization
- Diabetes medication management
- Lifestyle and dietary recommendations
- Complication screening and prevention
- Exercise and weight management guidance

#### **General Doctor Agent** 👨‍⚕️
Primary care physician specializing in:
- **Acute Care**: Common illnesses, infections, injuries
- **Chronic Disease**: Diabetes, hypertension, COPD management
- **Preventive Care**: Screenings, vaccinations, risk assessment
- **Mental Health**: Depression, anxiety screening
- **Comprehensive**: Adult, pediatric, geriatric care

**Key Capabilities:**
- General health assessment and diagnosis
- Common illness management
- Preventive care and health screening
- Medication management
- Chronic disease monitoring
- Health counseling and education

### 3. **Chat API (`/api/chat`)**
- **POST**: Stream AI responses with server-sent events (SSE)
- **GET**: Retrieve available doctor agents
- Patient context integration (optional)
- Real-time streaming responses
- Session-based authentication

### 4. **Chat UI (`/dashboard/chat`)**
Beautiful, responsive chat interface featuring:
- **Agent Selection**: Choose between specialized doctors
- **Patient Context**: Optionally include patient data in conversation
- **Real-time Streaming**: See responses as they're generated
- **Conversation History**: Full chat history maintained
- **Pre-built Prompts**: Quick-start questions for common topics
- **Responsive Design**: Works on desktop and mobile

## 🚀 Quick Start

### 1. Environment Setup

Add to your `.env`:

```bash
# DeepSeek API Key
DEEPSEEK_API_KEY=sk-your-api-key-here
```

Get your API key from: https://platform.deepseek.com/api_keys

### 2. Start Development Server

```bash
pnpm dev
```

### 3. Access AI Chat

1. Login to your dashboard: http://localhost:3000/auth/login
2. Navigate to **AI Assistant** in the navigation menu
3. Select a doctor agent (Diabetic Doctor or General Doctor)
4. Optionally select a patient for context
5. Start chatting!

## 💡 Usage Examples

### Example 1: Diabetes Consultation (Without Patient Data)

**Select**: Diabetic Doctor Agent  
**Patient Context**: None

**Sample Questions:**
- "What are the target HbA1c levels for different patient groups?"
- "When should I consider starting insulin therapy?"
- "How do I interpret continuous glucose monitoring data?"
- "What are the warning signs of diabetic ketoacidosis?"

### Example 2: Patient-Specific Analysis (With Patient Data)

**Select**: Diabetic Doctor Agent  
**Patient Context**: John Doe (select from dropdown)

**Sample Questions:**
- "Based on this patient's lab results, how is their diabetes control?"
- "What medication adjustments would you recommend?"
- "Are there any red flags in the recent trends?"
- "What should be the follow-up plan?"

When patient context is included, the AI has access to:
- Patient demographics (name, age, gender)
- Most recent lab results (HbA1c, glucose, lipids, renal function)
- Clinical notes
- Medications

### Example 3: General Medical Consultation

**Select**: General Doctor Agent  
**Patient Context**: Optional

**Sample Questions:**
- "What are the differential diagnoses for persistent cough?"
- "When should I refer a patient to a specialist?"
- "What preventive screenings are recommended for a 50-year-old male?"
- "How do I manage hypertension in elderly patients?"

## 🎨 UI Features

### Agent Capabilities Display
Each agent shows their specific capabilities:
- Diabetic Doctor: 6 specialized capabilities
- General Doctor: 6 primary care capabilities

### Conversation Management
- **Clear Chat**: Reset conversation history
- **Message Timestamps**: Track when messages were sent
- **Loading Indicators**: Visual feedback during AI response
- **Error Handling**: Clear error messages if something goes wrong

### Pre-built Prompts
Quick-start buttons with common questions:
- Early warning signs of diabetes
- HbA1c interpretation
- Lifestyle changes for diabetes
- Insulin therapy considerations

## 🔒 Security & Safety

### Authentication
- All chat endpoints require authentication
- Session validation on every request
- Patient data access control

### Medical Disclaimers
- Prominent disclaimer: "This is AI-assisted guidance"
- Always recommends consulting healthcare provider
- Not a replacement for professional medical advice

### Temperature Settings
- **Diabetic Doctor**: 0.3 (more conservative, factual)
- **General Doctor**: 0.5 (balanced creativity and accuracy)

### Data Privacy
- Patient context is optional
- Data only included when explicitly selected
- No conversation history stored in database
- In-memory only during session

## 🏗️ Architecture

### File Structure
```
lib/ai/
├── deepseek.ts         # DeepSeek API integration
└── agents.ts           # Doctor agent definitions & prompts

app/api/chat/
└── route.ts            # Chat API endpoints (Edge runtime)

app/dashboard/chat/
└── page.tsx            # Chat UI component
```

### Data Flow

1. **User Message** → Chat UI
2. **API Request** → `/api/chat` (POST)
3. **Agent Selection** → Load system prompt
4. **Patient Context** → Fetch from database (if selected)
5. **DeepSeek API** → Stream response
6. **SSE Stream** → Real-time updates to UI
7. **Display** → Formatted message in chat

### Edge Runtime
The chat API uses Edge runtime for:
- Lower latency
- Better scalability
- Streaming support
- Global distribution (when deployed)

## 📊 Agent System Prompts

Both agents have comprehensive system prompts including:
- **Clinical Guidelines**: Evidence-based standards
- **Assessment Approach**: Structured evaluation framework
- **Medication Knowledge**: Drug classes and protocols
- **Communication Style**: Patient-centered, clear
- **Safety Considerations**: Red flags, contraindications
- **Documentation**: Follow-up plans, monitoring

## 🔧 Customization

### Adding New Agents

1. Define agent in `lib/ai/agents.ts`:

```typescript
export const NEW_SPECIALIST_AGENT: DoctorAgent = {
  id: 'specialist-name',
  name: 'Dr. Specialist',
  specialty: 'Specialty Field',
  description: 'Agent description',
  icon: '🏥',
  capabilities: ['Capability 1', 'Capability 2'],
  systemPrompt: `Your comprehensive system prompt here...`,
};
```

2. Add to `getAllAgents()` function
3. Agent automatically appears in UI dropdown

### Modifying System Prompts

Edit the `systemPrompt` property in `/lib/ai/agents.ts`:
- Add clinical guidelines
- Modify communication style
- Include specific protocols
- Adjust safety considerations

### Adjusting Temperature

In `/app/api/chat/route.ts`, modify:

```typescript
const stream = await streamChatCompletion(chatMessages, {
  temperature: 0.3,  // Lower = more factual, Higher = more creative
  maxTokens: 3000,
});
```

## 📈 Future Enhancements

Potential additions:
- [ ] Conversation history persistence
- [ ] Export chat to PDF
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Image analysis (for lab reports, X-rays)
- [ ] Integration with medical knowledge bases
- [ ] Automated treatment plan generation
- [ ] Drug interaction checking
- [ ] Clinical decision support alerts

## 🐛 Troubleshooting

### "DEEPSEEK_API_KEY is not configured"
- Ensure `.env` file has `DEEPSEEK_API_KEY=sk-...`
- Restart dev server after adding

### Streaming not working
- Check browser console for errors
- Verify Edge runtime compatibility
- Test API endpoint directly with cURL

### Patient context not loading
- Verify patient belongs to logged-in doctor
- Check database connection
- Ensure patient has data to share

### Slow responses
- Check internet connection
- DeepSeek API may be rate-limited
- Try shorter, more specific questions

## 📝 API Reference

### POST /api/chat

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Your question here" }
  ],
  "agentId": "diabetic-doctor",
  "patientId": "uuid-optional",
  "includePatientContext": false
}
```

**Response:** Server-Sent Events (SSE)
```
data: {"choices":[{"delta":{"content":"Response"}}]}
data: [DONE]
```

### GET /api/chat

**Response:**
```json
{
  "agents": [
    {
      "id": "diabetic-doctor",
      "name": "Dr. Diabetes Specialist",
      "specialty": "Endocrinology & Diabetes Management",
      "description": "...",
      "icon": "🩺",
      "capabilities": ["..."]
    }
  ]
}
```

## 🎓 Medical Knowledge Base

The agents are programmed with:
- **Clinical Guidelines**: ADA, IDF, USPSTF
- **Normal Ranges**: Lab values, vitals
- **Medication Protocols**: Dosing, contraindications
- **Screening Guidelines**: Age-appropriate recommendations
- **Risk Calculators**: Cardiovascular, complications
- **Differential Diagnoses**: Common presentations

## ⚕️ Clinical Disclaimer

**Important**: This AI assistant is designed to support healthcare professionals, not replace them. All recommendations should be:
- Reviewed by qualified healthcare providers
- Individualized to each patient
- Verified against current clinical guidelines
- Considered in context of complete patient history
- Discussed with patients before implementation

The AI provides general medical knowledge and may not account for:
- Individual patient variations
- Recent medical literature updates
- Local practice patterns
- Insurance/formulary restrictions
- Patient preferences and values

Always use clinical judgment and consult specialists when appropriate.

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review code comments in agent files
3. Test with sample questions
4. Verify API key and environment setup

**Built with ❤️ using DeepSeek AI**
