# 🚀 Quick Reference - Intelligent Agent Routing

## Quick Start

### Basic Usage
1. **Start Chat**: Go to `/dashboard/chat`
2. **Select Patient**: Choose patient from dropdown (required for suggestions)
3. **Use General Doctor**: Default agent for initial consultation
4. **Describe Symptoms**: Type patient symptoms naturally
5. **Review Suggestion**: Modal appears if specialist recommended
6. **Accept or Decline**: Choose to switch or continue
7. **Continue Chatting**: Conversation flows with selected agent

## When Suggestions Appear

### ✅ Triggers
- Using **General Doctor** agent
- **Patient selected** from dropdown
- Message contains **medical keywords or symptoms**
- **Confidence score** >= threshold (20%)

### ❌ No Suggestions
- Already using a specialist agent
- No patient selected
- Message too general
- No matching symptoms/keywords

## Specialist Agents

| Agent | Icon | Keywords | Symptoms |
|-------|------|----------|----------|
| **General Doctor** | 👨‍⚕️ | Default | General health |
| **Diabetes Specialist** | 🩺 | diabetes, glucose, insulin, HbA1c | thirst, urination, fatigue |
| **Cardiology** | ❤️ | heart, cardiac, BP, chest pain | palpitations, chest pressure |
| **Nephrology** | 🫘 | kidney, renal, dialysis | reduced urine, swelling |
| **Endocrinology** | ⚕️ | thyroid, hormone, metabolic | weight change, mood swings |

## Example Phrases That Trigger Suggestions

### Diabetes Specialist
- "Patient has high blood sugar"
- "HbA1c is elevated"
- "Frequent urination and thirst"
- "Need insulin adjustment"

### Cardiology Specialist
- "Chest pain and shortness of breath"
- "Irregular heartbeat"
- "High blood pressure uncontrolled"
- "Palpitations"

### Nephrology Specialist
- "Kidney function declining"
- "Creatinine elevated"
- "Blood in urine"
- "Dialysis patient"

### Endocrinology Specialist
- "Thyroid problems"
- "Hormonal imbalance"
- "Unexplained weight changes"
- "Metabolic disorder"

## Modal Actions

### Accept Suggestion
1. Click "Switch to [Specialist]"
2. See system message confirming switch
3. Continue with specialist
4. Get targeted expertise

### Decline Suggestion
1. Click "Continue with General Doctor"
2. Message sent to General Doctor
3. No agent switch
4. Can manually switch later if needed

## Manual Agent Switching

**Anytime during chat:**
1. Use dropdown at top: "Select Doctor Agent"
2. Choose any specialist
3. Next message uses selected agent
4. No approval needed for manual switches

## Confidence Levels

| Score | Color | Meaning |
|-------|-------|---------|
| 70-95% | 🟢 Green | Strong recommendation |
| 50-69% | 🟡 Yellow | Moderate recommendation |
| 30-49% | 🟠 Orange | Weak recommendation |

## Tips for Best Results

### ✅ DO
- Select a patient before chatting
- Be specific with symptoms
- Mention relevant lab values
- Use medical terminology when known
- Review reasoning before accepting

### ❌ DON'T
- Start without selecting patient (suggestions won't work)
- Use very general questions
- Ignore confidence scores
- Feel pressured to accept (you control this!)

## Troubleshooting

### "No suggestion appearing"
- ✓ Check patient is selected
- ✓ Verify using General Doctor
- ✓ Message has medical content
- ✓ Wait for suggestion modal

### "Wrong specialist suggested"
- ✓ Decline and continue with General Doctor
- ✓ Or manually select correct specialist
- ✓ System learns from context over time

### "Want to switch back"
- ✓ Use dropdown to select General Doctor
- ✓ Or select any other specialist
- ✓ Can switch anytime

## Common Workflows

### Workflow 1: New Patient Consultation
```
1. Select patient → General Doctor
2. Describe initial symptoms
3. Suggestion appears → Review
4. Accept → Continue with specialist
5. Get targeted treatment plan
```

### Workflow 2: Follow-up Visit
```
1. Select patient → General Doctor
2. Review patient history
3. If specialist needed → Accept suggestion
4. Discuss specific condition management
```

### Workflow 3: Complex Case
```
1. Start with General Doctor
2. Get initial assessment
3. Accept specialist suggestion
4. Get specialized guidance
5. Manually switch to another specialist if needed
6. Comprehensive multi-specialty care
```

## Keyboard Shortcuts

- **Enter**: Send message
- **Esc**: Close suggestion modal (declines)
- **Tab**: Navigate between buttons

## API Endpoints

- `POST /api/chat/suggest-agent` - Get agent suggestion
- `POST /api/chat` - Send chat message
- `GET /api/chat` - Get available agents

## Files to Reference

- **Main Doc**: `/INTELLIGENT_AGENT_ROUTING.md` (detailed implementation)
- **Agent Logic**: `/lib/services/agent-routing.ts`
- **Modal UI**: `/components/AgentSuggestionModal.tsx`
- **Chat Page**: `/app/dashboard/chat/page.tsx`
- **Agents**: `/lib/ai/agents.ts`

---

## 🎯 Remember

**You're in control!** The system suggests, but you decide. Accept when helpful, decline when not. You can always manually switch agents using the dropdown anytime.
