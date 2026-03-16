# Quick Testing Guide - Field Mapping & Table View

## 🎯 What to Test

The field mapping system should now correctly map your CSV columns to the medical schema, create lab results, and display everything in an interactive table view.

## 📋 Testing Steps

### Step 1: Upload Your CSV

1. Navigate to `/dashboard/files/upload`
2. Select patient
3. Upload `ruth-diabetes-13years.csv` (or any CSV with custom column names)
4. Wait for processing

**Expected Result**: File uploads successfully, status = "ANALYZED"

### Step 2: Check File Details

1. Click on the uploaded file
2. Navigate to "Overview & Stats" tab
3. Look for "Data Cleaning Summary" section

**Expected Results**:
```
✅ Original Rows: 13
✅ Cleaned Rows: 13
✅ Success Rate: 100%
✅ Field Mappings: Shows number of fields automatically mapped
```

### Step 3: View Field Mappings

Still in "Overview & Stats" tab, scroll down to see cleaning metadata.

**Expected Results**:
```json
{
  "cleaning": {
    "fieldMappings": [
      {
        "original": "Blood_Glucose_mg_dL",
        "standard": "fasting_blood_glucose",
        "confidence": "high",
        "category": "labs"
      },
      {
        "original": "HbA1c_%",
        "standard": "hba1c",
        "confidence": "exact",
        "category": "labs"
      },
      // ... more mappings
    ]
  }
}
```

### Step 4: View Table View

1. Click on "Table View" tab
2. You should see an interactive table with:
   - Field mappings displayed at the top (Original → Standard with confidence badges)
   - Table with all medical records
   - Sortable columns
   - Category filter buttons

**Expected Results**:
```
✅ Field Mappings section shows: "Blood_Glucose_mg_dL → fasting_blood_glucose [high]"
✅ Table displays 13 rows of data
✅ Columns include: Visit Date, Blood Glucose, HbA1c, BP Systolic, BP Diastolic
✅ Category buttons show counts: Vitals (X), Labs (Y), etc.
```

**Try These Interactions**:
- Click column header to sort
- Type in search box to filter
- Click category buttons to show only vitals/labs/etc.
- Change items per page (10/25/50/100)
- Navigate pages if applicable

### Step 5: Verify Lab Results Created

Back in "Overview & Stats" tab, check "Extracted Data Summary" section.

**Expected Results**:
```
✅ Medical Records: 13
✅ Lab Results: >0 (should be around 52 for 13 rows × 4 lab fields)
   Previously this was 0 ❌, now should be >0 ✅
```

### Step 6: Generate AI Report

1. Navigate to "AI Reports" tab
2. Click "Summary Report"
3. Wait for generation (may take 10-30 seconds)

**Expected Results**:
```
✅ Report generates successfully
✅ Report contains actual data (not "Complete data unavailability")
✅ Report shows patient metrics, trends, statistics
✅ Report appears in markdown format with proper sections
```

Try generating other report types:
- Analytics Report
- Risk Assessment
- Trend Analysis

All should now have actual data instead of showing unavailability errors.

## 🔍 What to Look For

### Success Indicators ✅

1. **Field Mappings Present**:
   - Metadata includes `fieldMappings` array
   - Each mapping shows original, standard, confidence

2. **Lab Results Created**:
   - Lab Results count > 0
   - Previously was 0, now should reflect actual data

3. **Table View Works**:
   - All 13 records visible
   - Columns match your CSV fields
   - Sorting/filtering works

4. **AI Reports Have Data**:
   - No "unavailability" errors
   - Actual patient metrics displayed
   - Trends and statistics shown

### Failure Indicators ❌

1. **No Field Mappings**:
   - `fieldMappings` is empty or undefined
   - Check console for errors
   - Verify original headers were passed to cleaning function

2. **Lab Results Still 0**:
   - Field mapping didn't work
   - Check if column names are too different from expected
   - May need to add variations to `/lib/services/field-mapping.ts`

3. **Table View Empty**:
   - medicalRecords array is empty
   - Data cleaning failed
   - Check file metadata for errors

4. **AI Reports Still Show "Unavailability"**:
   - Lab results weren't created
   - Field mapping or data cleaning issue
   - Check patient has records in database

## 🐛 Troubleshooting

### Issue: Field Mappings Not Showing

**Debug Steps**:
```typescript
// 1. Check file metadata in browser console
console.log(file.metadata?.cleaning?.fieldMappings);

// 2. If undefined, check API response
// In /api/files/route.ts, add logging:
console.log('Cleaning result:', cleaningResult.metadata.fieldMappings);

// 3. Verify originalHeaders are being passed
console.log('Original headers:', originalHeaders);
```

**Possible Causes**:
- originalHeaders not extracted correctly
- cleanMedicalCSVData not receiving headers parameter
- Field mapping import failed

### Issue: Lab Results Still 0

**Debug Steps**:
```typescript
// 1. Check what fields were mapped
console.log(file.metadata?.cleaning?.fieldMappings);

// 2. Check cleaned data structure
console.log(cleaningResult.cleanedData[0]);

// 3. Verify required fields are present
// Should have: fasting_blood_glucose, hba1c, etc.
```

**Possible Causes**:
- Column names too different, no match found
- Need to add more variations to field-mapping.ts
- Data cleaning failed to apply mappings

### Issue: Table View Not Displaying

**Debug Steps**:
```typescript
// 1. Check medicalRecords array
console.log(file.medicalRecords);

// 2. Verify data structure
console.log(file.medicalRecords[0]);
// Should have: { visitDate, vitals: {...}, labResults: {...} }
```

**Possible Causes**:
- medicalRecords is empty
- Data structure doesn't match expected format
- File status not "ANALYZED"

## 📊 Expected Data Flow

```
1. CSV Upload
   └─> Extract original headers: ["Blood_Glucose_mg_dL", "HbA1c_%", ...]

2. Field Mapping
   └─> Map headers: 
       "Blood_Glucose_mg_dL" → "fasting_blood_glucose" (confidence: high)
       "HbA1c_%" → "hba1c" (confidence: exact)

3. Data Cleaning
   └─> Apply mapped headers to data
       Original: { Blood_Glucose_mg_dL: 120 }
       Cleaned:  { fasting_blood_glucose: 120 }

4. Medical Record Creation
   └─> Store in database with correct schema
       labResults: { fasting_blood_glucose: 120, hba1c: 6.5, ... }

5. Display
   └─> Table View: Show with field mapping indicators
       AI Reports: Use correctly structured data
```

## ✅ Quick Checklist

Before reporting issues, verify:

- [ ] CSV file uploaded successfully
- [ ] File status is "ANALYZED"
- [ ] Metadata includes cleaning information
- [ ] Field mappings array is present in metadata
- [ ] Lab Results count > 0
- [ ] Medical Records array has data
- [ ] Table View tab appears (if medicalRecords exists)
- [ ] Field mappings display in Table View
- [ ] Table shows all records
- [ ] Sorting and filtering work
- [ ] AI reports generate with actual data

## 🎯 Success Criteria

Your implementation is working correctly if:

1. ✅ **Field Mappings Created**: CSV columns automatically mapped to schema fields
2. ✅ **Lab Results Generated**: labResultsCreated > 0 (was 0 before)
3. ✅ **Table View Functional**: Interactive table with sorting/filtering
4. ✅ **Mapping Transparency**: Users see how columns were interpreted
5. ✅ **AI Reports Work**: Reports contain actual patient data

## 📞 Getting Help

If you encounter issues:

1. **Check Browser Console**: Look for JavaScript errors
2. **Check Server Logs**: Look for API errors
3. **Review Documentation**:
   - [FIELD_MAPPING_COMPLETE.md](./FIELD_MAPPING_COMPLETE.md)
   - [TABLE_VIEW_IMPLEMENTATION.md](./TABLE_VIEW_IMPLEMENTATION.md)
4. **Test with Sample CSV**: Try with known-good format first
5. **Verify Dependencies**: Ensure all imports are correct

## 🔧 Quick Fixes

### Fix: Recompile TypeScript
```bash
# If seeing type errors
pnpm run build
```

### Fix: Clear Database and Re-upload
```bash
# If data seems corrupted
pnpm prisma studio
# Delete file record
# Re-upload CSV
```

### Fix: Check Environment Variables
```bash
# Ensure DeepSeek API key is set
echo $DEEPSEEK_API_KEY
```

### Fix: Restart Development Server
```bash
# Sometimes Next.js needs a restart
pnpm run dev
```

## 🎉 Expected Output

After successful testing, you should see:

**File Upload**:
```
✅ ruth-diabetes-13years.csv uploaded
✅ 13 rows processed
✅ 4 fields automatically mapped
✅ 52 lab results created
✅ 0 errors, 0 warnings
```

**Table View**:
```
✅ Field Mappings: 4 fields (high/exact confidence)
✅ Interactive table with 13 records
✅ Sortable, filterable, paginated
✅ Category filters working
```

**AI Reports**:
```
✅ Summary Report: Generated successfully with patient data
✅ Analytics Report: Shows trends and statistics
✅ Risk Assessment: Identifies risks based on actual values
✅ Trend Analysis: Calculates changes over time
```

**Overall**:
```
✅ Bug Fixed: CSV columns now recognized
✅ Feature Added: Interactive table view
✅ Enhancement: Transparent field mapping
✅ Improvement: Better user experience
```

---

**Happy Testing! 🚀**

If everything works as expected, your CSV upload and analysis workflow is now fully functional with automatic field mapping and rich data visualization!
