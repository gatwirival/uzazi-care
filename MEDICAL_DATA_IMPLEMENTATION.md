# Medical Data System Implementation Guide

## ✅ What's Been Implemented

### 1. Scalable Medical Data Model (`lib/medical-data/schema.ts`)
- **MedicalRecord** interface: Reusable across different diseases
- Structured fields for vitals, lab results, medications, symptoms
- **DIABETES_CSV_SCHEMA**: Column mapping for CSV imports
- **DIABETES_NORMAL_RANGES**: Clinical reference ranges

### 2. Dummy Data Generator (`lib/medical-data/generator.ts`)
- Generates 6 years of diabetic patient records (24 quarterly visits)
- Realistic disease progression simulation
- Includes medications, symptoms, clinical notes
- Function: `generateDiabeticPatientData(patientId)`
- Function: `convertToCSV(records)` - exports to CSV format

### 3. CSV Parser (`lib/medical-data/parser.ts`)
- Parses medical CSV files using PapaCSV
- Validates required columns
- Calculates metadata (date ranges, averages)
- Function: `parseMedicalCSV(file)`
- Returns: `CSVParseResult` with parsed records and metadata

### 4. Sample Data API (`/api/sample-data/diabetic-patient/route.ts`)
- **Endpoint**: `GET /api/sample-data/diabetic-patient`
- Downloads a CSV file with 6 years of diabetic records
- Ready to test file upload system

### 5. CSV Viewer Component (`components/CSVViewer.tsx`)
- Three views: Summary, Table, Charts
- Real-time metrics with color-coded status
- Displays: HbA1c, Glucose, BP, BMI, eGFR trends
- Status indicators: Good/Warning/Danger

## 🚀 Next Steps to Complete

### Step 1: Enhance File Upload API

Update `/app/api/files/route.ts` POST handler:

```typescript
// Add CSV parsing
if (file.type === 'text/csv' || fileName.endsWith('.csv')) {
  const fileBuffer = Buffer.from(arrayBuffer);
  const fileText = fileBuffer.toString('utf-8');
  
  // Parse CSV
  const { parseMedicalCSV } = await import('@/lib/medical-data/parser');
  const parseResult = await parseMedicalCSV(fileText);
  
  if (!parseResult.success) {
    return NextResponse.json(
      { error: `CSV parsing failed: ${parseResult.errors?.join(', ')}` },
      { status: 400 }
    );
  }
  
  csvMetadata = {
    rowCount: parseResult.rowCount,
    columnCount: parseResult.headers?.length,
    headers: parseResult.headers,
    dateRange: parseResult.metadata?.dateRange,
    averageHbA1c: parseResult.metadata?.averageHbA1c,
    averageFastingGlucose: parseResult.metadata?.averageFastingGlucose,
  };
}
```

### Step 2: Create File Data Endpoint

Create `/app/api/files/[id]/data/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { parseMedicalCSV } from '@/lib/medical-data/parser';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  
  // Get file from database
  const file = await prisma.file.findFirst({
    where: { id, doctorId: session.user.id },
  });

  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  // Fetch file from Cloudinary and parse
  // For now, return metadata
  return NextResponse.json({
    records: [], // Parse actual file content here
    metadata: file.metadata,
  });
}
```

### Step 3: Create Analysis Agent

Create `/app/api/analyze/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { MedicalRecord, DIABETES_NORMAL_RANGES } from '@/lib/medical-data/schema';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: fileId } = await params;
  
  // Get file
  const file = await prisma.file.findFirst({
    where: { id: fileId, doctorId: session.user.id },
    include: { patient: true },
  });

  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  // Parse CSV and analyze
  const analysis = await analyzeDiabeticData(fileId, file);
  
  // Save analysis to database
  const inference = await prisma.inference.create({
    data: {
      fileId,
      patientId: file.patientId,
      inferenceType: 'diabetes-risk-assessment',
      status: 'COMPLETED',
      inputData: { fileMetadata: file.metadata },
      outputData: analysis,
      summary: analysis.summary,
      processingTimeMs: analysis.processingTimeMs,
    },
  });

  return NextResponse.json({ inference, analysis });
}

async function analyzeDiabeticData(fileId: string, file: any) {
  const startTime = Date.now();
  
  // Get CSV metadata
  const metadata = file.metadata as any;
  const avgHbA1c = metadata?.averageHbA1c || 0;
  const avgGlucose = metadata?.averageFastingGlucose || 0;
  
  // Rule-based analysis
  const findings: string[] = [];
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  
  // HbA1c analysis
  if (avgHbA1c >= 9.0) {
    findings.push(`Critical HbA1c level (${avgHbA1c}%) - Immediate intervention required`);
    riskLevel = 'critical';
  } else if (avgHbA1c >= 7.5) {
    findings.push(`Elevated HbA1c (${avgHbA1c}%) - Poor glycemic control`);
    riskLevel = 'high';
  } else if (avgHbA1c >= 7.0) {
    findings.push(`HbA1c slightly above target (${avgHbA1c}%)`);
    if (riskLevel === 'low') riskLevel = 'medium';
  } else if (avgHbA1c < 7.0) {
    findings.push(`Good glycemic control - HbA1c at target (${avgHbA1c}%)`);
  }
  
  // Glucose analysis
  if (avgGlucose > 140) {
    findings.push(`Elevated average fasting glucose (${avgGlucose} mg/dL)`);
    if (riskLevel === 'low') riskLevel = 'medium';
  } else if (avgGlucose > 125) {
    findings.push(`Fasting glucose above pre-diabetes threshold (${avgGlucose} mg/dL)`);
  } else if (avgGlucose <= 100) {
    findings.push(`Normal fasting glucose levels (${avgGlucose} mg/dL)`);
  }
  
  // Recommendations
  const recommendations: string[] = [];
  
  if (riskLevel === 'critical' || riskLevel === 'high') {
    recommendations.push('Schedule urgent endocrinology consultation');
    recommendations.push('Consider medication adjustment or intensification');
    recommendations.push('Increase glucose monitoring frequency to 3-4 times daily');
  }
  
  if (avgHbA1c > 7.0) {
    recommendations.push('Reinforce dietary modifications - reduce refined carbohydrates');
    recommendations.push('Increase physical activity to 150+ minutes per week');
    recommendations.push('Consider diabetes education program enrollment');
  }
  
  recommendations.push('Annual comprehensive eye examination');
  recommendations.push('Annual foot examination for neuropathy');
  recommendations.push('Monitor kidney function (eGFR, urine albumin)');
  
  // Suggested tests
  const suggestedTests: string[] = [];
  
  if (avgHbA1c > 7.5) {
    suggestedTests.push('C-peptide level to assess insulin production');
    suggestedTests.push('Thyroid function tests');
  }
  
  suggestedTests.push('Lipid panel (if not done in last 3 months)');
  suggestedTests.push('Comprehensive metabolic panel');
  suggestedTests.push('Urine microalbumin');
  
  const summary = `
Analysis of ${metadata.rowCount || 0} visits over ${calculateDateRangeDuration(metadata.dateRange)}.
Risk Level: ${riskLevel.toUpperCase()}
Average HbA1c: ${avgHbA1c}% (Target: <7.0%)
Average Fasting Glucose: ${avgGlucose} mg/dL (Target: <100 mg/dL)
${findings.length} key findings identified.
${recommendations.length} recommendations generated.
  `.trim();
  
  return {
    summary,
    riskLevel,
    findings,
    recommendations,
    suggestedTests,
    metrics: {
      avgHbA1c,
      avgFastingGlucose: avgGlucose,
      totalVisits: metadata.rowCount,
      dateRange: metadata.dateRange,
    },
    processingTimeMs: Date.now() - startTime,
  };
}

function calculateDateRangeDuration(dateRange?: { start: string; end: string }): string {
  if (!dateRange) return 'unknown period';
  
  const start = new Date(dateRange.start);
  const end = new Date(dateRange.end);
  const diffYears = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  
  return `${Math.round(diffYears * 10) / 10} years`;
}
```

### Step 4: Add Analysis UI Component

Create `components/AnalysisResults.tsx`:

```typescript
"use client";

interface AnalysisResultsProps {
  analysis: {
    summary: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    findings: string[];
    recommendations: string[];
    suggestedTests: string[];
    metrics: any;
  };
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const riskColors = {
    low: 'bg-green-50 border-green-200 text-green-800',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    high: 'bg-orange-50 border-orange-200 text-orange-800',
    critical: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Risk Level Badge */}
      <div className={`border rounded-lg p-4 ${riskColors[analysis.riskLevel]}`}>
        <h3 className="font-bold text-lg">
          Risk Level: {analysis.riskLevel.toUpperCase()}
        </h3>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg border p-4">
        <h4 className="font-semibold mb-2">Summary</h4>
        <p className="text-sm whitespace-pre-line">{analysis.summary}</p>
      </div>

      {/* Findings */}
      <div className="bg-white rounded-lg border p-4">
        <h4 className="font-semibold mb-3">Key Findings</h4>
        <ul className="space-y-2">
          {analysis.findings.map((finding, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-sm">{finding}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg border p-4">
        <h4 className="font-semibold mb-3">Recommendations</h4>
        <ol className="space-y-2">
          {analysis.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-green-600 mr-2 font-semibold">{idx + 1}.</span>
              <span className="text-sm">{rec}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Suggested Tests */}
      <div className="bg-white rounded-lg border p-4">
        <h4 className="font-semibold mb-3">Suggested Tests</h4>
        <ul className="space-y-2">
          {analysis.suggestedTests.map((test, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-purple-600 mr-2">✓</span>
              <span className="text-sm">{test}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

## 📋 Testing Steps

### 1. Generate Sample Data
```bash
# Start dev server
pnpm dev

# Download sample CSV
curl http://localhost:3000/api/sample-data/diabetic-patient > sample_patient.csv
```

### 2. Test File Upload
1. Login to dashboard
2. Go to Files → Upload
3. Upload the `sample_patient.csv`
4. Verify CSV is parsed and metadata displayed

### 3. Test Analysis
1. Click "Analyze" button on uploaded file
2. View generated insights
3. Check database for inference record

### 4. View Results
- Summary with risk level
- Key findings
- Recommendations
- Suggested tests

## 🎯 Next Features (Future)

1. **Real LLM Integration**: Replace rule-based analysis with GPT-4/Claude
2. **Time-series Charts**: Add Chart.js for visualizations
3. **Export Reports**: PDF generation of analysis
4. **Multi-disease Support**: Extend schema for cardiology, oncology, etc.
5. **Predictive Analytics**: Forecast HbA1c trends
6. **Alert System**: Notify when metrics exceed thresholds

## 📊 Data Model Benefits

The current schema is **highly scalable**:

- **Disease-agnostic vitals**: BP, HR, weight work for all conditions
- **Flexible lab results**: Easy to add new biomarkers
- **Medications array**: Supports poly-pharmacy
- **Symptoms/diagnosis arrays**: Multi-morbidity ready
- **CSV column mapping**: Easily adapt for different CSV formats

This foundation supports:
- Cardiology (troponin, BNP, ECG data)
- Nephrology (dialysis parameters)
- Oncology (tumor markers, chemo cycles)
- Any chronic disease monitoring!
