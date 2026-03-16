# Quick Testing Guide - AI-Powered Reports

## Prerequisites

1. **Environment Variables Set**:
```bash
# Check your .env file has:
DEEPSEEK_API_KEY=your-key-here
DATABASE_URL=your-database-url
```

2. **Install Dependencies** (if not already done):
```bash
pnpm install
```

3. **Start Development Server**:
```bash
pnpm dev
```

## Test Workflow

### Step 1: Create a Test Patient

1. Navigate to: `http://localhost:3000/dashboard/patients/new`
2. Fill in patient details:
   - **Name**: Ruth Test Patient
   - **Email**: ruth.test@example.com
   - **Date of Birth**: 01/15/1970
   - **Gender**: FEMALE
3. Click "Add Patient"
4. Note the patient ID from the URL or patients list

### Step 2: Upload CSV File

**Option A: Use Sample CSV File**

1. Go to: `http://localhost:3000/dashboard/files/upload`
2. Select patient: Ruth Test Patient
3. Upload the file: `ruth-diabetes-13years.csv` (in project root)
4. Click "Upload File"
5. Wait for processing (~5-10 seconds)

**Option B: Test with Custom CSV**

Create a CSV file with these headers:
```csv
visit_date,fasting_blood_glucose,hba1c,bp_systolic,bp_diastolic,weight,bmi
2024-01-15,145,7.2,138,88,85,28.5
2024-04-10,132,6.9,135,85,83,27.8
2024-07-20,128,6.7,132,82,81,27.1
2024-10-05,125,6.5,130,80,80,26.8
```

### Step 3: Verify Data Cleaning

1. After upload, click "Details & Reports" on the file
2. Check "Data Cleaning Summary" section:
   - Should show original vs. cleaned rows
   - Success rate percentage
   - Any warnings or errors
3. Verify "Extracted Data Summary":
   - Medical Records count
   - Lab Results count
   - Diagnoses count

### Step 4: Generate AI Reports

1. Stay on the file details page
2. Click "AI Reports" tab
3. Generate each report type:

**Test A: Summary Report**
- Click "📊 Summary Report" button
- Wait 10-30 seconds
- Verify report appears with:
  - Patient status overview
  - Health metrics table
  - Key observations
  - Proper markdown formatting (bold, bullets, tables)

**Test B: Analytics Report**
- Click "📈 Analytics Report" button
- Wait 10-30 seconds
- Verify report includes:
  - Temporal trends
  - Statistical summaries
  - Correlation analysis
  - Comparison tables

**Test C: Risk Assessment**
- Click "⚠️ Risk Assessment" button
- Wait 10-30 seconds
- Verify report shows:
  - Risk level (🔴 High / 🟡 Medium / 🟢 Low)
  - Risk factors
  - Recommendations
  - Red flags section

**Test D: Trend Analysis**
- Click "📉 Trend Analysis" button
- Wait 10-30 seconds
- Verify report contains:
  - Detailed metric trends
  - Volatility calculations
  - Predictive indicators
  - Trend insights

### Step 5: Verify Report Content

For each generated report, check:

✅ **Formatting**:
- Headers are rendered as headers (not # symbols)
- **Bold text** is bold
- *Italic text* is italic
- Tables are properly formatted
- Bullet lists use proper bullets

✅ **Content Quality**:
- Mentions patient data correctly
- Shows actual values from CSV
- Calculates averages accurately
- Identifies trends correctly
- Provides relevant recommendations

✅ **Insights Section**:
- Key insights extracted and listed
- Recommendations separated out
- Risk score calculated (if applicable)

✅ **UI Features**:
- Report list shows all generated reports
- Can switch between reports
- Can close report viewer
- Previous reports persisted

## Expected Results

### Data Cleaning:
```
✅ Original Rows: 50
✅ Cleaned Rows: 48
✅ Rows Removed: 2
✅ Success Rate: 96%
⚠️ Warnings: Row 15: Missing HbA1c - skipped
```

### Summary Report Example:
```markdown
# Patient Summary Report

**Current Status**: Patient shows improving glycemic control...

## Latest Visit (2024-10-05)
- HbA1c: 6.5% ✓ (Target: <7%)
- Fasting Glucose: 125 mg/dL ✓
- BP: 130/80 mmHg ✓
- BMI: 26.8 (Overweight)

## Key Metrics Dashboard
| Metric | Current | Target | Status | Trend |
|--------|---------|--------|--------|-------|
| HbA1c | 6.5% | <7% | ✓ | ↓ Decreasing |
| Glucose | 125 mg/dL | <130 | ✓ | ↓ Decreasing |
...
```

### Analytics Report Example:
```markdown
# Analytics Report

## Temporal Trends
- HbA1c decreased from 7.2% to 6.5% (9.7% reduction)
- Average glucose: 132.5 mg/dL
- Weight loss: 5 kg over 9 months

## Statistical Summary
| Metric | Mean | Std Dev | CV% | Stability |
|--------|------|---------|-----|-----------|
| HbA1c | 6.83% | 0.31 | 4.5% | Stable |
...
```

## Troubleshooting

### Issue: "No medical records found"
**Solution**: 
- Verify CSV was uploaded and processed
- Check file status is "ANALYZED"
- Ensure data cleaning succeeded

### Issue: "Failed to generate report"
**Solution**:
- Check DEEPSEEK_API_KEY in .env
- Verify DeepSeek API is accessible
- Check browser console for errors
- Review server logs: `pnpm dev`

### Issue: Report content looks like raw markdown
**Solution**:
- Verify ReactMarkdown is imported
- Check remark-gfm is installed
- Clear .next cache: `rm -rf .next && pnpm dev`

### Issue: Cleaning shows 0% success rate
**Solution**:
- Check CSV has required fields: visit_date, hba1c, fasting_blood_glucose
- Verify date format is valid (YYYY-MM-DD, MM/DD/YYYY, etc.)
- Check numeric fields have valid numbers

## API Testing (Optional)

### Test Data Cleaning Directly:
```bash
# Create test CSV
cat > test-data.csv << EOF
visit_date,hba1c,fasting_blood_glucose
2024-01-15,7.2,145
invalid-date,abc,xyz
2024-03-10,6.8,130
EOF

# The upload endpoint will auto-clean this
```

### Test Report Generation via API:
```bash
# Get patient ID first, then:
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "your-patient-id-here",
    "reportType": "summary"
  }'
```

## Success Criteria

✅ CSV file uploads successfully
✅ Data cleaning shows >90% success rate
✅ All 4 report types generate without errors
✅ Reports display with proper markdown formatting
✅ Insights and recommendations extracted
✅ Reports saved and viewable from list
✅ No console errors
✅ Loading states work correctly
✅ Error messages display if issues occur

## Next Steps After Testing

1. **Review Generated Reports**: Check accuracy of AI analysis
2. **Test Edge Cases**: Upload CSV with missing data, outliers
3. **Test Error Handling**: Invalid CSV format, missing required fields
4. **Performance**: Test with large CSV files (100+ rows)
5. **Multi-Patient**: Test with multiple patients
6. **Report History**: Generate multiple reports for same patient

## Getting Help

If you encounter issues:
1. Check `/AI_POWERED_REPORTS_GUIDE.md` for detailed documentation
2. Review cleaning warnings in file metadata
3. Check server logs for API errors
4. Verify database contains cleaned records:
   ```bash
   # View records in database
   npx prisma studio
   ```

Happy Testing! 🎉
