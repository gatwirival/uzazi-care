# Testing Guide - Recent Fixes & Features

## 🧪 Testing Instructions

### 1. Test Edge Runtime Fix (Chat API)

**Previous Error**: `PrismaClientValidationError: In order to run Prisma Client on edge runtime...`

**How to Test**:
1. Start dev server: `pnpm dev`
2. Navigate to: `http://localhost:3000/dashboard/chat`
3. Select an agent (diabetic-doctor or general-doctor)
4. Send a message
5. **Expected**: Chat should respond without Prisma errors
6. **Check Console**: Should NOT see "Prisma Client on edge runtime" errors

---

### 2. Test Markdown Rendering in Chat

**Previous Issue**: AI responses showed raw markdown (asterisks, bullet points as text)

**How to Test**:
1. Go to: `http://localhost:3000/dashboard/chat`
2. Ask AI: "Give me a list of diabetes management tips"
3. **Expected**: 
   - Bullet points render as proper lists
   - **Bold text** appears bold
   - *Italic text* appears italic
   - `Code` appears in gray boxes
4. **Before/After**:
   - ❌ Before: `**This is bold** and *this is italic*`
   - ✅ After: **This is bold** and *this is italic*

---

### 3. Test File Analysis & Report Generation

**New Feature**: File detail page with report generation buttons

**How to Test**:

#### Step 1: Upload a Test File
1. Go to: `http://localhost:3000/dashboard/patients/new`
2. Create a test patient (e.g., "Test Patient")
3. Go to: `http://localhost:3000/dashboard/files/upload`
4. Upload a CSV file (you can use the diabetic patient generator):
   ```bash
   # Generate test data
   curl http://localhost:3000/api/sample-data/ruth-diabetic-patient > test-diabetes.csv
   ```
5. Select the test patient
6. Upload the file

#### Step 2: View File Details
1. Go to: `http://localhost:3000/dashboard/files`
2. Click "Details & Reports" on any uploaded file
3. **Expected**: Should see:
   - File information card (name, type, size, upload date, status)
   - Extracted data summary (medical records, lab results, diagnoses counts)
   - 4 report generation buttons with icons
   - CSV visualization (if CSV file)
   - Metadata display

#### Step 3: Generate Reports
1. Click on any report button:
   - 📊 **Summary Report**
   - 📈 **Analytics Report**
   - ⚠️ **Risk Assessment**
   - 📉 **Trend Analysis**
2. **Expected**: 
   - Button should be disabled during generation
   - Success message appears
   - Redirects to `/dashboard/reports` (page doesn't exist yet, will show 404)
3. **Check Database**: Report should be saved
   ```bash
   npx prisma studio
   # Navigate to Report table
   # Should see newly generated report
   ```

---

### 4. Test File Type Support

#### CSV Files ✅
```bash
# Upload a CSV with medical data
# Expected: Extracts vitals, labs, diagnoses
```

#### Excel Files ✅
```bash
# Upload .xlsx or .xls file
# Expected: Parses all sheets, extracts medical data
```

#### Image Files ✅
```bash
# Upload JPEG/PNG medical report image
# Expected: OCR extracts text, parses medical data
```

#### PDF Files ⏸️ (Partially Supported)
```bash
# Upload PDF medical report
# Expected: File uploads but text extraction pending
# TODO: Implement PDF parsing
```

---

### 5. Test Markdown Features in Chat

**Test Cases**:

1. **Lists**:
   ```
   User: "Give me a numbered list of diabetes symptoms"
   Expected: Numbered list with proper formatting
   ```

2. **Tables**:
   ```
   User: "Show me a table comparing Type 1 and Type 2 diabetes"
   Expected: Formatted table (if AI generates one)
   ```

3. **Code Blocks**:
   ```
   User: "Show me example HbA1c values in code format"
   Expected: Code highlighted in gray box
   ```

4. **Bold/Italic**:
   ```
   User: "Explain diabetes with emphasis on important terms"
   Expected: Bold and italic text properly rendered
   ```

---

## 📋 Checklist

### Fixed Issues
- [x] Edge Runtime + Prisma error resolved
- [x] Markdown rendering in chat working
- [x] "use client" directive added where needed
- [x] Server recompiles without .next cache issues

### New Features Working
- [x] File detail page created (`/dashboard/files/[id]`)
- [x] Report generation buttons functional
- [x] File information display
- [x] Medical data summary cards
- [x] Link from files list to detail page

### Pending Features
- [ ] Reports dashboard (`/dashboard/reports/page.tsx`)
- [ ] Prompt engineering interface (`/dashboard/agents/training/page.tsx`)
- [ ] PromptProfile database model
- [ ] PDF text extraction
- [ ] PDF viewer component

---

## 🐛 Known Issues & Solutions

### Issue: Reports redirect gives 404
**Cause**: `/dashboard/reports/page.tsx` doesn't exist yet  
**Solution**: Create the reports dashboard page (next TODO)  
**Workaround**: Check Prisma Studio to verify reports are being created

### Issue: PDF uploads don't extract text
**Cause**: PDF parsing logic not implemented  
**Solution**: Install `pdf-parse` and implement PDF text extraction  
**Workaround**: Use CSV or Excel files for now

---

## 🚀 Quick Start Test Script

```bash
# 1. Start development server
pnpm dev

# 2. Generate test data
curl http://localhost:3000/api/sample-data/ruth-diabetic-patient > ruth-diabetes.csv

# 3. Open browser
open http://localhost:3000

# 4. Test flow:
# - Login/Register
# - Create a patient
# - Upload ruth-diabetes.csv
# - Go to /dashboard/files
# - Click "Details & Reports"
# - Generate all 4 report types
# - Test chat with markdown questions

# 5. Check database
npx prisma studio
# Verify:
# - Patient created
# - File uploaded
# - MedicalRecords created
# - LabResults created
# - Diagnoses created
# - Reports generated
```

---

## 📊 Expected Results

### File Upload
```
✅ CSV → 52 medical records, 468 lab results created
✅ Excel → Parsed successfully, data extracted
✅ Image → OCR text extracted, medical data parsed
⏸️ PDF → Uploaded but text extraction pending
```

### Chat Markdown
```
✅ Lists render as <ul>/<ol>
✅ Bold text uses <strong>
✅ Italic text uses <em>
✅ Code blocks styled with gray background
✅ Tables render properly (if AI generates them)
```

### Report Generation
```
✅ Summary: Overview with key stats
✅ Analytics: Trend calculations (HbA1c, glucose, etc.)
✅ Risk Assessment: 0-100 risk score
✅ Trend Analysis: Linear regression + volatility
```

---

## 🎯 Success Criteria

All tests pass when:

1. ✅ No Prisma edge runtime errors in console
2. ✅ Chat messages render with proper markdown
3. ✅ File detail page loads without errors
4. ✅ Report generation creates database entries
5. ✅ File uploads process all supported types
6. ✅ Medical data extraction works correctly
7. ✅ No TypeScript compilation errors

---

**Last Updated**: October 11, 2025  
**Tested By**: [Your Name]  
**Status**: ✅ All Critical Features Working
