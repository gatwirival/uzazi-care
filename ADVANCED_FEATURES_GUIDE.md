# Advanced Medical Data Platform - Implementation Guide

## Overview

This document describes the comprehensive enhancements made to ClinIntelAI to support advanced document processing, structured data analysis, intelligent agent routing, and model fine-tuning capabilities.

## Features Implemented

### 1. Multi-Format Document Upload & Processing

#### Supported Formats
- **CSV Files**: Parsed to JSON with automatic medical data structure detection
- **Excel Files (.xlsx, .xls)**: Full spreadsheet parsing with multi-sheet support
- **Images (JPEG, PNG)**: OCR text extraction with medical data parsing
- **PDF/Text**: Content extraction and analysis

#### Processing Pipeline
```
File Upload → Format Detection → Parsing/OCR → Structured Data Extraction → Database Ingestion
```

#### Key Components

**Excel/CSV Parser** (`/lib/parsers/excel.ts`):
- Parses Excel and CSV files to JSON
- Auto-detects medical data columns (vitals, labs, diagnoses)
- Extracts metadata (date ranges, patient IDs)
- Converts to normalized medical record format

**OCR Service** (`/lib/ocr/index.ts`):
- Tesseract.js for local OCR processing
- Google Cloud Vision API integration for cloud OCR
- Medical text parsing (extracts patient info, vitals, labs, medications, diagnoses)
- Confidence scoring

**Data Ingestion Service** (`/lib/services/medical-ingestion.ts`):
- Converts parsed data to structured database records
- Creates MedicalRecord, LabResult, and Diagnosis entries
- LOINC codes for lab results
- ICD-10 code extraction for diagnoses

### 2. Structured Medical Data Models

#### New Database Tables

**MedicalRecord**:
- Stores structured medical data from all sources
- FHIR-compatible JSON format
- Links to files and patients
- Supports vitals, lab results, diagnoses, prescriptions, clinical notes

**LabResult**:
- Individual lab test results
- LOINC codes for standardization
- Reference ranges and status (normal/abnormal/critical)
- Automatic status determination

**Diagnosis**:
- Patient diagnoses extracted from records
- ICD-10 code support
- Status tracking (active/resolved/chronic)
- Severity levels

**Report**:
- Generated analytics and insights
- Multiple report types (summary, analytics, risk assessment, trend analysis)
- AI-generated recommendations
- Risk scoring

**AgentKnowledge**:
- Doctor's custom knowledge base for AI agents
- Fine-tuning data per specialty
- Priority-based knowledge retrieval

**AgentSuggestion**:
- Tracks AI agent recommendations
- Analytics on agent routing effectiveness

### 3. Medical Reports & Analytics Engine

#### Report Types

**Summary Report** (`/api/reports?reportType=summary`):
- Total medical records overview
- Unique diagnoses list
- Date range of medical history
- Quick statistics

**Analytics Report** (`/api/reports?reportType=analytics`):
- Lab trends over time (HbA1c, glucose, cholesterol, etc.)
- Trend direction (increasing/decreasing/stable)
- Statistical analysis (average, min, max)
- Automated insights generation

**Risk Assessment Report** (`/api/reports?reportType=risk_assessment`):
- Calculates overall risk score (0-100)
- Risk factors based on:
  - Age
  - Chronic conditions (diabetes, cardiovascular, kidney disease)
  - Lab values (HbA1c, LDL, eGFR)
- Risk level classification (Low/Moderate/High)
- Personalized recommendations

**Trend Analysis Report** (`/api/reports?reportType=trend_analysis`):
- Time-series analysis of key metrics
- Trend slopes and volatility
- Percent change over time
- Visual data points for charting

#### Analytics Features
- Linear regression for trend calculation
- Volatility analysis (coefficient of variation)
- Automated insight generation
- Clinical recommendation engine

### 4. Intelligent Agent Routing System

#### How It Works

1. **Initial Contact**: User starts conversation with General Doctor agent
2. **Symptom Analysis**: System analyzes user message for medical keywords
3. **Agent Suggestion**: If specialized care detected, suggests appropriate specialist:
   - **Diabetes Specialist**: For blood sugar, insulin, HbA1c mentions
   - **Cardiology Specialist**: For heart, blood pressure, chest pain
   - **Nephrology Specialist**: For kidney, renal, dialysis topics
   - **Endocrinology Specialist**: For thyroid, hormones, metabolic issues

4. **Context Enhancement**: Checks patient's diagnosis history to boost relevance
5. **Confidence Scoring**: Only suggests if confidence ≥ 20%
6. **Seamless Handoff**: Doctor can accept suggestion or continue with current agent

#### Agent Routing Service (`/lib/services/agent-routing.ts`):
```typescript
// Example usage
const suggestion = await suggestAgent(userMessage, patientId);
// Returns: {
//   agentId: 'diabetic-doctor',
//   agentName: 'Diabetes Specialist',
//   confidence: 0.85,
//   reason: 'Based on keywords: diabetes, blood sugar, hba1c',
//   keywords: ['diabetes', 'blood sugar', 'hba1c']
// }
```

#### Frontend Integration
Suggestions are sent via SSE stream:
```typescript
{
  type: 'agent_suggestion',
  suggestion: { agentId, agentName, confidence, reason }
}
```

### 5. Model Fine-Tuning Interface

#### Doctor's Knowledge Base

Doctors can add custom knowledge to AI agents through:

**API**: `/api/agents/knowledge`
- GET: Retrieve all knowledge entries (optionally filtered by agent type)
- POST: Add new knowledge entry
- PATCH: Update existing entry
- DELETE: Remove entry

**Knowledge Structure**:
```typescript
{
  agentType: 'diabetic-doctor',  // Which agent to enhance
  category: 'treatments',         // symptoms, treatments, guidelines, custom_prompt
  title: 'Latest Diabetes Guidelines',
  content: 'Detailed clinical guidelines...',
  priority: 10,                   // Higher = used first
  isActive: true,
  metadata: {}                    // Additional structured data
}
```

**Categories**:
- **symptoms**: Custom symptom descriptions and interpretations
- **treatments**: Preferred treatment protocols
- **guidelines**: Clinical practice guidelines
- **custom_prompt**: Additional context for AI responses

**Integration with Chat**:
Custom knowledge is automatically injected into agent prompts:
```typescript
const customKnowledge = await getAgentKnowledge(doctorId, agentType);
chatMessages.push({
  role: 'system',
  content: `DOCTOR'S CUSTOM KNOWLEDGE BASE:\n\n${customKnowledge.join('\n\n')}`
});
```

## API Endpoints

### File Upload & Processing
```
POST /api/files
- Upload CSV, Excel, images, PDFs
- Automatic parsing and OCR
- Structured data ingestion
- Returns: file metadata + ingestion results
```

### Reports
```
GET /api/reports?patientId=xxx
- Get all reports for a patient

POST /api/reports
- Generate new report
- Body: { patientId, reportType: 'summary' | 'analytics' | 'risk_assessment' | 'trend_analysis' }
- Returns: Generated report with insights and recommendations
```

### Agent Knowledge Management
```
GET /api/agents/knowledge?agentType=diabetic-doctor
- Get all knowledge entries for agent

POST /api/agents/knowledge
- Add new knowledge entry
- Body: { agentType, category, title, content, priority }

PATCH /api/agents/knowledge?id=xxx
- Update knowledge entry

DELETE /api/agents/knowledge?id=xxx
- Delete knowledge entry
```

### Enhanced Chat
```
POST /api/chat
- Includes intelligent agent routing
- Custom knowledge injection
- Agent suggestions via SSE
- Body: { messages, agentId, patientId, includePatientContext, files }
```

## Usage Examples

### 1. Upload Medical Records CSV

```typescript
const formData = new FormData();
formData.append('file', csvFile);
formData.append('patientId', 'patient-id');

const response = await fetch('/api/files', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
// result.ingestion contains:
// - recordsCreated: 52 (e.g., Ruth's 13-year data)
// - labResultsCreated: 468 (9 labs × 52 visits)
// - diagnosesCreated: 156
```

### 2. Upload Medical Image with OCR

```typescript
const formData = new FormData();
formData.append('file', labReportImage);
formData.append('patientId', 'patient-id');

const response = await fetch('/api/files', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
// result.file.metadata.extractedData contains:
// - patientInfo: { name, dob, id }
// - vitals: { bloodPressure, heartRate, temperature }
// - labResults: [{ test, value, unit, range }]
// - medications: ['Metformin 1000mg...']
```

### 3. Generate Risk Assessment

```typescript
const response = await fetch('/api/reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientId: 'patient-id',
    reportType: 'risk_assessment',
  }),
});

const report = await response.json();
// report.content contains:
// - riskScore: 45 (0-100)
// - riskLevel: 'Moderate'
// - riskFactors: ['Age 68', 'Type 2 Diabetes', 'High LDL: 165']
// - insights: ['Overall risk score: 45/100', ...]
// - recommendations: ['Regular monitoring advised', ...]
```

### 4. Add Custom Knowledge to Diabetic Agent

```typescript
const response = await fetch('/api/agents/knowledge', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentType: 'diabetic-doctor',
    category: 'guidelines',
    title: 'Our Clinic HbA1c Targets',
    content: `For our diabetic patients:
    - Target HbA1c < 6.5% for newly diagnosed
    - Target HbA1c < 7.0% for most adults
    - Target HbA1c < 7.5% for elderly (>75 years)
    - Consider individualization based on comorbidities`,
    priority: 10,
  }),
});
```

### 5. Chat with Agent Routing

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'My blood sugar has been 200+ and I feel dizzy' }
    ],
    agentId: 'general-doctor',
    patientId: 'patient-id',
    includePatientContext: true,
  }),
});

// Response will include agent suggestion:
// {
//   type: 'agent_suggestion',
//   suggestion: {
//     agentId: 'diabetic-doctor',
//     agentName: 'Diabetes Specialist',
//     confidence: 0.92,
//     reason: 'Based on keywords: blood sugar, dizzy'
//   }
// }
```

## Database Schema

### Medical Records Structure
```sql
medical_records
├── id (uuid)
├── patient_id (uuid) → patients
├── file_id (uuid) → files
├── record_type (text: 'vitals', 'lab_result', 'diagnosis', 'prescription', 'note')
├── record_date (timestamp)
├── data (jsonb: FHIR-compatible structured data)
├── source (text: 'manual', 'csv', 'excel', 'ocr', 'image')
└── relations: labResults[], diagnoses[]

lab_results
├── id (uuid)
├── medical_record_id (uuid) → medical_records
├── test_name (text)
├── test_code (text: LOINC code)
├── value (text)
├── unit (text)
├── reference_range (text)
└── status (text: 'normal', 'abnormal', 'critical')

diagnoses
├── id (uuid)
├── medical_record_id (uuid) → medical_records
├── diagnosis_code (text: ICD-10 code)
├── diagnosis_name (text)
├── severity (text: 'mild', 'moderate', 'severe')
└── status (text: 'active', 'resolved', 'chronic')

reports
├── id (uuid)
├── patient_id (uuid) → patients
├── report_type (text: 'summary', 'analytics', 'risk_assessment', 'trend_analysis')
├── title (text)
├── content (jsonb: structured report data)
├── insights (text[])
├── recommendations (text[])
└── risk_score (decimal)

agent_knowledge
├── id (uuid)
├── doctor_id (uuid) → users
├── agent_type (text: 'diabetic-doctor', 'cardiology-specialist', etc.)
├── category (text: 'symptoms', 'treatments', 'guidelines', 'custom_prompt')
├── title (text)
├── content (text)
├── is_active (boolean)
└── priority (integer)
```

## FHIR Compatibility

The system is designed with FHIR (Fast Healthcare Interoperability Resources) in mind:

- **LOINC codes** for lab tests
- **ICD-10 codes** for diagnoses
- **JSON structure** allows future FHIR resource mapping
- **Extensible metadata** for additional FHIR properties

## Performance & Optimization

- **Batch Ingestion**: Processes multiple records in single transaction
- **Indexed Queries**: Database indexes on patientId, recordDate, testName, diagnosisCode
- **Edge Runtime**: Chat API uses Edge runtime for low latency
- **Streaming Responses**: SSE for real-time chat and agent suggestions
- **OCR Caching**: Tesseract worker reuse for efficient OCR

## Security & Privacy

- **Authentication**: All endpoints require valid session
- **Authorization**: Doctors can only access their patients' data
- **Data Encryption**: Sensitive patient data encrypted at rest
- **HIPAA Considerations**: Structured for compliance (consult legal team)

## Next Steps (UI Implementation)

1. **Reports Dashboard** (`/dashboard/reports`):
   - List all generated reports
   - View report details with charts
   - Export to PDF/CSV
   - Generate new reports

2. **Agent Fine-Tuning UI** (`/dashboard/agents/fine-tune`):
   - Manage knowledge base entries
   - Test agent responses with custom knowledge
   - Analytics on agent suggestion acceptance

3. **Enhanced File Upload UI**:
   - Drag-and-drop multi-file upload
   - Real-time ingestion progress
   - Preview extracted data before saving

4. **Medical Record Viewer**:
   - Timeline view of patient's medical history
   - Lab trends visualization
   - Diagnosis progression

## Testing

### Test the APIs:

```bash
# 1. Upload Ruth's 13-year diabetes data
curl -X GET http://localhost:3000/api/sample-data/ruth-diabetic-patient > ruth-data.csv

curl -X POST http://localhost:3000/api/files \
  -F "file=@ruth-data.csv" \
  -F "patientId=YOUR_PATIENT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. Generate risk assessment
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{"patientId":"YOUR_PATIENT_ID","reportType":"risk_assessment"}'

# 3. Add custom knowledge
curl -X POST http://localhost:3000/api/agents/knowledge \
  -H "Content-Type: application/json" \
  -d '{
    "agentType":"diabetic-doctor",
    "category":"guidelines",
    "title":"HbA1c Targets",
    "content":"Target <7% for most adults",
    "priority":10
  }'

# 4. Chat with agent routing
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages":[{"role":"user","content":"My blood sugar is 250 mg/dL"}],
    "agentId":"general-doctor"
  }'
```

## Technology Stack

- **Backend**: Next.js 15, Edge Runtime
- **Database**: PostgreSQL (Neon), Prisma ORM
- **AI**: DeepSeek API
- **OCR**: Tesseract.js, Google Cloud Vision API
- **Excel Parsing**: xlsx library
- **Authentication**: NextAuth.js
- **File Storage**: Cloudinary

## Conclusion

This implementation provides a comprehensive medical data platform with:
✅ Multi-format document processing (CSV, Excel, Images)
✅ Structured data storage (FHIR-compatible)
✅ Advanced analytics & reporting
✅ Intelligent agent routing
✅ Doctor customizable AI agents
✅ Risk assessment & trend analysis

The system is ready for production deployment and can be extended with:
- Additional specialist agents
- More report types
- FHIR resource export
- HL7 integration
- Advanced ML models for predictions
