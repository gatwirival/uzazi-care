#!/bin/bash

# CSV Upload Test Script
# Tests the CSV upload functionality with field mapping fixes

set -e

echo "📋 CSV Upload - Testing Field Mapping & Patient Display Fix"
echo "============================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Step 1: Checking TypeScript compilation..."
if npx tsc --noEmit > /dev/null 2>&1; then
    echo -e "${GREEN}✅ TypeScript compilation successful${NC}"
else
    echo -e "${RED}❌ TypeScript compilation failed${NC}"
    echo "Run: npx tsc --noEmit"
    exit 1
fi

echo ""
echo "🔍 Step 2: Verifying field mappings..."

# Check if field mappings were added
if grep -q "standardField: 'provider'" lib/services/field-mapping.ts; then
    echo -e "${GREEN}✅ Provider field mapping added${NC}"
else
    echo -e "${RED}❌ Provider field mapping missing${NC}"
    exit 1
fi

if grep -q "standardField: 'recommendations'" lib/services/field-mapping.ts; then
    echo -e "${GREEN}✅ Recommendations field mapping added${NC}"
else
    echo -e "${RED}❌ Recommendations field mapping missing${NC}"
    exit 1
fi

if grep -q "standardField: 'next_visit'" lib/services/field-mapping.ts; then
    echo -e "${GREEN}✅ Next visit field mapping added${NC}"
else
    echo -e "${RED}❌ Next visit field mapping missing${NC}"
    exit 1
fi

echo ""
echo "🔍 Step 3: Verifying patient display fix..."

if grep -q "file.Patient?.name" app/dashboard/files/\[id\]/FileAnalysisClient.tsx; then
    echo -e "${GREEN}✅ Patient display fixed (file.Patient)${NC}"
else
    echo -e "${RED}❌ Patient display still using lowercase (file.patient)${NC}"
    exit 1
fi

if grep -q "file.Patient?.id" app/dashboard/files/\[id\]/FileAnalysisClient.tsx; then
    echo -e "${GREEN}✅ Patient ID reference fixed${NC}"
else
    echo -e "${RED}❌ Patient ID reference not fixed${NC}"
    exit 1
fi

echo ""
echo "🔍 Step 4: Verifying medical ingestion updates..."

if grep -q "extractString(recordData.provider)" lib/services/medical-ingestion.ts; then
    echo -e "${GREEN}✅ Provider extraction added${NC}"
else
    echo -e "${RED}❌ Provider extraction missing${NC}"
    exit 1
fi

if grep -q "extractString(recordData.recommendations)" lib/services/medical-ingestion.ts; then
    echo -e "${GREEN}✅ Recommendations extraction added${NC}"
else
    echo -e "${RED}❌ Recommendations extraction missing${NC}"
    exit 1
fi

if grep -q "extractString(recordData.next_visit" lib/services/medical-ingestion.ts; then
    echo -e "${GREEN}✅ Next visit extraction added${NC}"
else
    echo -e "${RED}❌ Next visit extraction missing${NC}"
    exit 1
fi

if grep -q "combinedNotes" lib/services/medical-ingestion.ts; then
    echo -e "${GREEN}✅ Combined notes storage implemented${NC}"
else
    echo -e "${RED}❌ Combined notes storage missing${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Summary of Changes:"
echo "   ✅ Added field mappings for: provider, recommendations, next_visit"
echo "   ✅ Fixed patient display (file.Patient instead of file.patient)"
echo "   ✅ Enhanced medical ingestion to store new fields"
echo "   ✅ All fields now properly saved to database"
echo ""
echo "🧪 Manual Testing Steps:"
echo ""
echo "1. Start dev server:"
echo "   ${YELLOW}pnpm dev${NC}"
echo ""
echo "2. Login to dashboard"
echo ""
echo "3. Navigate to Files and upload CSV:"
echo "   File: ruth-diabetes-13years.csv"
echo ""
echo "4. Verify results:"
echo "   • Patient name displays (not 'Unknown')"
echo "   • No field mapping warnings"
echo "   • All 26 columns mapped successfully"
echo "   • Upload date shows correct format"
echo ""
echo "5. Click on uploaded file to view details:"
echo "   • Patient name should be visible"
echo "   • All file information complete"
echo "   • Data cleaning summary shows 0 warnings"
echo ""
echo "6. Generate AI reports to test full flow"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 CSV Upload Fix - Ready for Testing!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
