/**
 * Medical Data Ingestion Service
 * Converts parsed files to structured medical records in the database
 */

import { prisma } from '@/lib/db';

export interface IngestionResult {
  success: boolean;
  recordsCreated: number;
  labResultsCreated: number;
  diagnosesCreated: number;
  errors: string[];
}

/**
 * Ingest structured medical data into the database
 */
export async function ingestMedicalData(
  patientId: string,
  fileId: string,
  data: Array<{
    recordType: string;
    recordDate: string;
    data: any;
    source: string;
  }>
): Promise<IngestionResult> {
  const result: IngestionResult = {
    success: true,
    recordsCreated: 0,
    labResultsCreated: 0,
    diagnosesCreated: 0,
    errors: [],
  };

  try {
    for (const item of data) {
      try {
        // Create medical record
        const medicalRecord = await prisma.medicalRecord.create({
          data: {
            patientId,
            fileId,
            recordType: item.recordType,
            recordDate: new Date(item.recordDate),
            data: item.data,
            source: item.source,
          },
        });

        result.recordsCreated++;

        // Extract and create lab results if applicable
        if (item.recordType === 'lab_result') {
          const labCount = await createLabResults(medicalRecord.id, item.data);
          result.labResultsCreated += labCount;
        }

        // Extract and create diagnoses if applicable
        if (item.recordType === 'diagnosis') {
          const diagnosisCount = await createDiagnoses(medicalRecord.id, item.data);
          result.diagnosesCreated += diagnosisCount;
        }
      } catch (error: any) {
        result.errors.push(`Failed to ingest record: ${error.message}`);
      }
    }
  } catch (error: any) {
    result.success = false;
    result.errors.push(error.message);
  }

  return result;
}

/**
 * Create lab results from structured data
 */
async function createLabResults(
  medicalRecordId: string,
  data: any
): Promise<number> {
  let count = 0;

  // Common lab test mappings - support both snake_case and camelCase
  const labTests = [
    { fields: ['hba1c'], name: 'HbA1c', code: '4548-4', unit: '%', range: '<7%' },
    { fields: ['fasting_blood_glucose', 'fastingBloodGlucose', 'fbg'], name: 'Fasting Blood Glucose', code: '1558-6', unit: 'mg/dL', range: '70-100' },
    { fields: ['random_blood_glucose', 'randomBloodGlucose'], name: 'Random Blood Glucose', code: '2339-0', unit: 'mg/dL', range: '<140' },
    { fields: ['total_cholesterol', 'totalCholesterol'], name: 'Total Cholesterol', code: '2093-3', unit: 'mg/dL', range: '<200' },
    { fields: ['ldl', 'ldl_cholesterol', 'ldlCholesterol'], name: 'LDL Cholesterol', code: '2089-1', unit: 'mg/dL', range: '<100' },
    { fields: ['hdl', 'hdl_cholesterol', 'hdlCholesterol'], name: 'HDL Cholesterol', code: '2085-9', unit: 'mg/dL', range: '>40' },
    { fields: ['triglycerides'], name: 'Triglycerides', code: '2571-8', unit: 'mg/dL', range: '<150' },
    { fields: ['creatinine', 'serum_creatinine'], name: 'Creatinine', code: '2160-0', unit: 'mg/dL', range: '0.7-1.3' },
    { fields: ['egfr', 'gfr'], name: 'eGFR', code: '33914-3', unit: 'mL/min/1.73m²', range: '>60' },
    { fields: ['urine_albumin', 'urineAlbumin'], name: 'Urine Albumin', code: '14957-5', unit: 'mg/L', range: '<30' },
    { fields: ['bp_systolic', 'systolic_bp', 'systolic'], name: 'Systolic Blood Pressure', code: '8480-6', unit: 'mmHg', range: '<120' },
    { fields: ['bp_diastolic', 'diastolic_bp', 'diastolic'], name: 'Diastolic Blood Pressure', code: '8462-4', unit: 'mmHg', range: '<80' },
    { fields: ['heart_rate', 'pulse'], name: 'Heart Rate', code: '8867-4', unit: 'bpm', range: '60-100' },
    { fields: ['weight'], name: 'Weight', code: '29463-7', unit: 'kg', range: 'varies' },
    { fields: ['bmi', 'body_mass_index'], name: 'BMI', code: '39156-5', unit: 'kg/m²', range: '18.5-24.9' },
    { fields: ['temperature', 'body_temperature'], name: 'Temperature', code: '8310-5', unit: '°F', range: '97.8-99.1' },
  ];

  for (const test of labTests) {
    // Try all field variations
    let value: any = undefined;
    let foundField: string | undefined;
    
    for (const field of test.fields) {
      if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
        value = data[field];
        foundField = field;
        break;
      }
    }
    
    if (value !== undefined) {
      try {
        const valueStr = String(value);
        const numericValue = parseFloat(valueStr);
        
        let status = 'normal';
        if (!isNaN(numericValue)) {
          status = determineLabStatus(test.name, numericValue);
        }

        await prisma.labResult.create({
          data: {
            medicalRecordId,
            testName: test.name,
            testCode: test.code, // LOINC code
            value: valueStr,
            unit: test.unit,
            referenceRange: test.range,
            status,
          },
        });

        count++;
      } catch (error) {
        console.error(`Failed to create lab result for ${test.name}:`, error);
      }
    }
  }

  return count;
}

/**
 * Determine lab result status based on value
 */
function determineLabStatus(testName: string, value: number): string {
  const thresholds: Record<string, { normal: [number, number]; critical?: number }> = {
    'HbA1c': { normal: [0, 7], critical: 9 },
    'Fasting Blood Glucose': { normal: [70, 100], critical: 180 },
    'Random Blood Glucose': { normal: [0, 140], critical: 200 },
    'Total Cholesterol': { normal: [0, 200] },
    'LDL Cholesterol': { normal: [0, 100] },
    'HDL Cholesterol': { normal: [40, Infinity] },
    'Triglycerides': { normal: [0, 150] },
    'Creatinine': { normal: [0.7, 1.3] },
    'eGFR': { normal: [60, Infinity] },
    'Urine Albumin': { normal: [0, 30] },
  };

  const threshold = thresholds[testName];
  if (!threshold) return 'normal';

  if (threshold.critical && value >= threshold.critical) {
    return 'critical';
  }

  if (value >= threshold.normal[0] && value <= threshold.normal[1]) {
    return 'normal';
  }

  return 'abnormal';
}

/**
 * Create diagnoses from structured data
 */
async function createDiagnoses(
  medicalRecordId: string,
  data: any
): Promise<number> {
  let count = 0;

  // Check for diagnosis fields
  const diagnosisFields = ['diagnosis', 'diagnoses', 'condition', 'conditions'];
  
  for (const field of diagnosisFields) {
    if (data[field]) {
      const diagnoses = Array.isArray(data[field]) ? data[field] : [data[field]];
      
      for (const diagnosis of diagnoses) {
        if (typeof diagnosis === 'string' && diagnosis.trim()) {
          try {
            // Try to extract ICD-10 code if present
            const icd10Match = diagnosis.match(/\b([A-Z]\d{2}\.?\d{0,2})\b/);
            const diagnosisCode = icd10Match ? icd10Match[1] : null;
            
            // Clean diagnosis name
            const diagnosisName = diagnosisCode 
              ? diagnosis.replace(diagnosisCode, '').trim()
              : diagnosis.trim();

            await prisma.diagnosis.create({
              data: {
                medicalRecordId,
                diagnosisCode,
                diagnosisName,
                status: 'active',
              },
            });

            count++;
          } catch (error) {
            console.error('Failed to create diagnosis:', error);
          }
        }
      }
    }
  }

  return count;
}

/**
 * Ingest OCR results from medical images
 */
export async function ingestOCRData(
  patientId: string,
  fileId: string,
  ocrResult: {
    text: string;
    parsedData?: any;
  }
): Promise<IngestionResult> {
  const result: IngestionResult = {
    success: true,
    recordsCreated: 0,
    labResultsCreated: 0,
    diagnosesCreated: 0,
    errors: [],
  };

  try {
    // Create a general medical record with the OCR text
    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        patientId,
        fileId,
        recordType: 'note',
        recordDate: new Date(),
        data: {
          rawText: ocrResult.text,
          ...ocrResult.parsedData,
        },
        source: 'ocr',
      },
    });

    result.recordsCreated++;

    // If parsed data contains lab results, create them
    if (ocrResult.parsedData?.labResults) {
      for (const lab of ocrResult.parsedData.labResults) {
        try {
          await prisma.labResult.create({
            data: {
              medicalRecordId: medicalRecord.id,
              testName: lab.test,
              value: lab.value,
              unit: lab.unit || '',
              referenceRange: lab.range,
              status: 'normal', // TODO: Determine from value and range
            },
          });
          result.labResultsCreated++;
        } catch (error) {
          console.error('Failed to create lab result from OCR:', error);
        }
      }
    }

    // If parsed data contains diagnoses, create them
    if (ocrResult.parsedData?.diagnoses) {
      for (const diagnosis of ocrResult.parsedData.diagnoses) {
        try {
          await prisma.diagnosis.create({
            data: {
              medicalRecordId: medicalRecord.id,
              diagnosisName: diagnosis,
              status: 'active',
            },
          });
          result.diagnosesCreated++;
        } catch (error) {
          console.error('Failed to create diagnosis from OCR:', error);
        }
      }
    }
  } catch (error: any) {
    result.success = false;
    result.errors.push(error.message);
  }

  return result;
}
