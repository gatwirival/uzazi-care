# 📊 CSV File Upload - Quick Start Guide

## ✅ What Works Now

**CSV files are now fully supported** in the AI chat for medical data analysis!

---

## 🚀 How to Use

### Step 1: Go to Chat
Navigate to `/dashboard/chat`

### Step 2: Select Agent
Choose **Diabetes Specialist** or **General Doctor**

### Step 3: Upload CSV
1. Click the **📎 attachment icon**
2. Select your CSV file (e.g., `elizabeth-diabetes-4years.csv`)
3. File appears as a chip above the input

### Step 4: Ask Questions
Type your question about the data:

**Example Questions:**
```
"What are the early warning signs of diabetes?"
"Analyze the blood sugar trends in this data"
"What patterns do you see over the 4 years?"
"Identify any concerning health trends"
"Summarize the patient's diabetes progression"
"What recommendations would you make based on this data?"
```

---

## 💡 Example Usage

### Real Example from Your System

**Upload:** `elizabeth-diabetes-4years.csv`

**Question:** "What are the early warning signs of diabetes?"

**AI Response:** Gemini will analyze:
- All HbA1c values over 4 years
- Fasting blood glucose trends
- Weight/BMI changes
- Blood pressure patterns
- Medication history
- Provider recommendations

Then provide:
- Specific early warning signs visible in THIS patient's data
- Timeline of diabetes progression
- Key health indicators that changed
- Recommendations based on the actual data

---

## 📋 CSV Format Requirements

### ✅ Supported Columns

Your CSV should have headers like:
```csv
visit_date,visit_type,bp_systolic,bp_diastolic,heart_rate,weight,
height,bmi,temperature,fasting_blood_glucose,hba1c,
random_blood_glucose,total_cholesterol,ldl,hdl,triglycerides,
creatinine,egfr,urine_albumin,symptoms,medications,notes,
diagnosis,provider,recommendations,next_visit
```

### ✅ What the AI Analyzes

| Data Type | What AI Looks For |
|-----------|------------------|
| **Dates** | Progression over time, gaps in care |
| **Lab Values** | Trends, abnormalities, correlations |
| **Vitals** | BP patterns, weight changes, heart rate |
| **Medications** | Treatment history, changes |
| **Symptoms** | Progression, new complaints |
| **Notes** | Provider observations, concerns |

---

## 🎯 Best Results

### DO ✅
- Include **column headers** in first row
- Use **consistent date formats** (YYYY-MM-DD)
- Include **all available data** (up to 200 rows analyzed)
- Ask **specific questions** about the data
- Mention **timeframes** ("over the past year")

### DON'T ❌
- Upload files without headers
- Mix different patient data in one file
- Ask vague questions like "analyze this"
- Expect analysis of 1000+ rows (first 200 used)

---

## 📊 Data Limits

| Limit | Value | Note |
|-------|-------|------|
| Max file size | 10 MB | Recommended: < 1 MB |
| Rows analyzed | 200 | After header row |
| Columns | Unlimited | All parsed |
| Files per message | 1 | Upload one CSV at a time for best results |

---

## 🔍 What Happens Behind the Scenes

```
1. You upload CSV file
   ↓
2. Frontend reads file content
   ↓
3. API parses CSV structure
   ↓
4. Data formatted for Gemini:
   - Headers extracted
   - Row count calculated
   - Full data included (up to 200 rows)
   ↓
5. Appended to your question
   ↓
6. Sent to Gemini 2.0 Flash
   ↓
7. AI analyzes patterns, trends, anomalies
   ↓
8. Streaming response to you
```

---

## 💬 Sample Conversations

### Conversation 1: Diabetes Progression
```
👤 Upload: elizabeth-diabetes-4years.csv
👤 Ask: "What are the early warning signs of diabetes?"

🤖 Response:
"Based on the 4-year medical data for Elizabeth:

EARLY WARNING SIGNS VISIBLE IN THIS DATA:

1. **Gradual HbA1c Increase** (Year 1 → Year 4)
   - Started: 5.8% (pre-diabetic range)
   - Now: 7.2% (diabetic range)
   - Trend: Consistent upward progression

2. **Fasting Blood Glucose Rising**
   - Year 1: 105 mg/dL (slightly elevated)
   - Year 4: 145 mg/dL (diabetic range)
   - Pattern: Progressive deterioration

3. **Weight Gain**
   - Gained 15 lbs over 4 years
   - BMI increased from 27 → 30

[Detailed analysis continues...]"
```

### Conversation 2: Treatment Effectiveness
```
👤 Upload: ruth-diabetes-13years.csv
👤 Ask: "Is the current treatment working?"

🤖 Response:
"Analyzing Ruth's 13-year diabetes management data:

TREATMENT EFFECTIVENESS ASSESSMENT:

✅ POSITIVE INDICATORS:
- HbA1c stabilized at 6.8% (last 2 years)
- Metformin + Glipizide combination effective
- Blood pressure well-controlled (125/78 avg)

⚠️ AREAS OF CONCERN:
- Random glucose still spikes to 180+ mg/dL
- Recent weight gain (5 lbs in 6 months)
- Medication adherence noted as 'partial' in last visit

RECOMMENDATIONS:
[Detailed recommendations based on actual data...]"
```

---

## 🚨 Troubleshooting

### Issue: AI says "Okay" but doesn't analyze

**Solution:** ✅ FIXED! The system now properly formats CSV data for analysis.

### Issue: Only first few rows analyzed

**Explanation:** System analyzes up to 200 rows for performance. For full dataset analysis, use the Files section to upload and generate full AI reports.

### Issue: CSV not recognized

**Check:**
- File has `.csv` extension
- First row contains headers
- Uses comma separators (not semicolons or tabs)

### Issue: Incomplete analysis

**Try:**
- Be more specific in your question
- Ask about particular time periods
- Request specific metrics (HbA1c, glucose, etc.)

---

## 🎓 Advanced Tips

### Tip 1: Compare Time Periods
```
"Compare Elizabeth's diabetes control in years 1-2 vs years 3-4"
```

### Tip 2: Focus on Specific Metrics
```
"Analyze only the HbA1c and fasting glucose trends"
```

### Tip 3: Risk Assessment
```
"Based on this data, what are the risk factors for complications?"
```

### Tip 4: Medication Analysis
```
"How did the medication changes in year 2 affect the lab results?"
```

### Tip 5: Lifestyle Factors
```
"What correlations exist between weight changes and glucose control?"
```

---

## 📖 Related Features

**For Deeper Analysis:**
1. Upload CSV to `/dashboard/files`
2. Generate AI-powered medical reports
3. Get 4 report types:
   - Summary Report
   - Analytics Report
   - Risk Assessment
   - Trend Analysis

**See:**
- `AI_REPORTS_QUICK_REF.md` - AI report generation
- `CSV_UPLOAD_QUICK_REF.md` - File upload system
- `GEMINI_FILE_UPLOAD_GUIDE.md` - Full multimodal guide

---

## ✅ Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| CSV Upload | ✅ WORKING | Up to 200 rows analyzed |
| Image Upload | 🚧 COMING SOON | Multimodal support ready |
| PDF Upload | 🚧 COMING SOON | Document analysis ready |
| Real-time Analysis | ✅ WORKING | Streaming responses |
| Pattern Detection | ✅ WORKING | AI-powered insights |

---

## 🎉 You're Ready!

Try it now:
1. Go to `/dashboard/chat`
2. Upload `elizabeth-diabetes-4years.csv`
3. Ask: "What are the early warning signs of diabetes?"
4. Get detailed, data-driven analysis!

**Model**: Gemini 2.0 Flash  
**Max Tokens**: 2000  
**Temperature**: 0.3 (medical accuracy)  
**Streaming**: Enabled  

---

**Last Updated**: October 15, 2025  
**Status**: ✅ Fully Operational
