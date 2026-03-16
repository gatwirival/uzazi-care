# Quick Start Guide - Advanced Medical Data Features

## Prerequisites

1. **Install Dependencies**:
```bash
pnpm install
```

2. **Environment Variables**:
Add to your `.env` file:
```env
# Optional: Google Cloud Vision for better OCR
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
# OR
GOOGLE_CLOUD_VISION_API_KEY=your-api-key
```

3. **Database Migration**:
```bash
npx prisma migrate dev
```

## Feature 1: Upload & Process Medical Documents

### Upload CSV/Excel File

```typescript
// Frontend example
const formData = new FormData();
formData.append('file', csvFile); // or excelFile
formData.append('patientId', selectedPatientId);

const response = await fetch('/api/files', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log('Records created:', result.ingestion.recordsCreated);
console.log('Lab results:', result.ingestion.labResultsCreated);
```

### Upload Medical Image with OCR

```typescript
const formData = new FormData();
formData.append('file', imageFile); // JPEG/PNG lab report
formData.append('patientId', selectedPatientId);

const response = await fetch('/api/files', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log('Extracted text:', result.file.metadata.extractedData);
```

## Feature 2: Generate Medical Reports

### Risk Assessment Report

```typescript
const response = await fetch('/api/reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientId: selectedPatientId,
    reportType: 'risk_assessment',
  }),
});

const { report } = await response.json();
console.log('Risk Score:', report.riskScore);
console.log('Risk Factors:', report.content.riskFactors);
console.log('Recommendations:', report.recommendations);
```

### Analytics & Trends Report

```typescript
const response = await fetch('/api/reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientId: selectedPatientId,
    reportType: 'analytics',
  }),
});

const { report } = await response.json();
console.log('HbA1c Trend:', report.content.labTrends.HbA1c);
// Shows: { trend: 'increasing', latest: 7.8, average: 7.2 }
```

## Feature 3: Intelligent Agent Routing

### Chat with Auto-Agent Detection

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'I have chest pain and my blood pressure is 160/100' }
    ],
    agentId: 'general-doctor',
    patientId: selectedPatientId,
    includePatientContext: true,
  }),
});

// Stream response
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      
      // Check for agent suggestion
      if (data.type === 'agent_suggestion') {
        console.log('Suggested Agent:', data.suggestion.agentName);
        console.log('Confidence:', data.suggestion.confidence);
        console.log('Reason:', data.suggestion.reason);
        
        // Show UI to switch to suggested agent
        showAgentSwitchPrompt(data.suggestion);
      }
    }
  }
}
```

## Feature 4: Fine-Tune AI Agents

### Add Custom Knowledge

```typescript
const response = await fetch('/api/agents/knowledge', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentType: 'diabetic-doctor',
    category: 'guidelines',
    title: 'Our Clinic HbA1c Protocol',
    content: `
      Target HbA1c levels for our patients:
      - Newly diagnosed: <6.5%
      - Most adults: <7.0%
      - Elderly (>75): <7.5%
      - Adjust based on:
        * Hypoglycemia risk
        * Life expectancy
        * Comorbidities
    `,
    priority: 10, // Higher priority knowledge is used first
  }),
});

const { knowledge } = await response.json();
console.log('Knowledge added:', knowledge.id);
```

### Get All Knowledge for an Agent

```typescript
const response = await fetch('/api/agents/knowledge?agentType=diabetic-doctor');
const { knowledge } = await response.json();

knowledge.forEach(k => {
  console.log(`${k.title} (Priority: ${k.priority})`);
  console.log(k.content);
});
```

### Update Knowledge

```typescript
const response = await fetch(`/api/agents/knowledge?id=${knowledgeId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'Updated clinical guidelines...',
    priority: 15, // Increase priority
  }),
});
```

## Complete Example: Patient Workflow

```typescript
// 1. Upload patient's medical records CSV
const uploadFormData = new FormData();
uploadFormData.append('file', csvFile);
uploadFormData.append('patientId', patientId);

const uploadResult = await fetch('/api/files', {
  method: 'POST',
  body: uploadFormData,
});

const { ingestion } = await uploadResult.json();
console.log(`Imported ${ingestion.recordsCreated} medical records`);

// 2. Generate risk assessment
const riskReport = await fetch('/api/reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientId,
    reportType: 'risk_assessment',
  }),
});

const { report } = await riskReport.json();
console.log(`Risk Score: ${report.riskScore}/100 (${report.content.riskLevel})`);

// 3. Chat about the patient with AI
const chatResponse = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Analyze this patient\'s diabetes progression' }
    ],
    agentId: 'diabetic-doctor',
    patientId,
    includePatientContext: true,
  }),
});

// Stream AI response
for await (const chunk of streamResponse(chatResponse)) {
  if (chunk.type === 'content') {
    console.log(chunk.text);
  } else if (chunk.type === 'agent_suggestion') {
    console.log('AI suggests switching to:', chunk.suggestion.agentName);
  }
}
```

## Testing with Ruth's 13-Year Diabetes Data

```bash
# 1. Generate Ruth's data
curl http://localhost:3000/api/sample-data/ruth-diabetic-patient > ruth-diabetes.csv

# 2. Create a test patient
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ruth Test Patient",
    "dateOfBirth": "1970-01-01",
    "gender": "FEMALE"
  }'

# 3. Upload Ruth's data (replace PATIENT_ID)
curl -X POST http://localhost:3000/api/files \
  -F "file=@ruth-diabetes.csv" \
  -F "patientId=PATIENT_ID"

# 4. Generate reports
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{"patientId":"PATIENT_ID","reportType":"risk_assessment"}'

curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{"patientId":"PATIENT_ID","reportType":"analytics"}'
```

## Common Use Cases

### 1. Import Hospital Lab Results

```typescript
// User uploads lab report PDF/image
// OCR extracts: HbA1c 8.2%, Glucose 180 mg/dL, etc.
// System creates structured lab results
// Risk assessment automatically updates
```

### 2. Continuous Glucose Monitoring Data

```typescript
// Import CSV from CGM device
// System detects glucose readings
// Creates time-series medical records
// Generates trend analysis report
```

### 3. Multi-Specialist Consultation

```typescript
// Start with general doctor
// Mentions "kidney function eGFR 45"
// System suggests nephrology specialist
// Doctor switches to get specialized insights
```

### 4. Custom Treatment Protocols

```typescript
// Add clinic-specific diabetes protocol
// Agent uses this knowledge in responses
// Consistent care across all doctor-patient chats
```

## Troubleshooting

### OCR Not Working?
- Install Tesseract language data: `npm install tesseract.js-langs`
- For better quality, set up Google Cloud Vision API
- Ensure images are clear and high resolution

### No Agent Suggestions?
- Check that message contains medical keywords
- Ensure patientId is provided for context boost
- Verify patient has relevant diagnoses in database

### Reports Empty?
- Confirm patient has medical records uploaded
- Check that lab results were parsed correctly
- Verify date ranges in medical records

## Next Steps

1. **Build Reports Dashboard UI** - See `/dashboard/reports` route
2. **Create Agent Fine-Tuning Page** - See `/dashboard/agents/fine-tune` route
3. **Add Charts & Visualizations** - Use report data with Chart.js/Recharts
4. **Export Reports** - Add PDF generation with jsPDF

## Support

For issues or questions:
1. Check `ADVANCED_FEATURES_GUIDE.md` for detailed documentation
2. Review API responses for error messages
3. Check console logs for ingestion details
