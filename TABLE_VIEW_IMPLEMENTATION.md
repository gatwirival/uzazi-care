# CSV Table View Implementation Guide

## Overview

The CSV Table View is an interactive component that displays medical data in a sortable, filterable table format with automatic field mapping support. It provides transparency into how CSV column names are mapped to the standardized medical schema.

## Features

### 1. **Interactive Table Display**
- Sortable columns (click to sort ascending/descending)
- Filterable data (text search across all columns)
- Pagination (10/25/50/100 records per page)
- Category filtering (Visit Info, Vitals, Labs, Medications, Clinical Notes)

### 2. **Field Mapping Transparency**
- Visual display of original → standard field mappings
- Confidence levels (Exact, High, Low) with color coding
- Category-based organization (Vitals, Labs, Medications, etc.)
- Automatic mapping detection using fuzzy matching

### 3. **Data Organization**
- Hierarchical column structure (vitals, labResults, etc.)
- Sticky row numbers for easy tracking
- Responsive design with horizontal scrolling
- Dark mode support

### 4. **Advanced Features**
- Category-based filtering with counts
- Dynamic column hiding based on selected category
- Empty value handling (displays "-" for null/undefined)
- Truncated long values with full text on hover

## File Structure

```
components/
  CSVTableView.tsx          # Main table view component
app/
  dashboard/
    files/
      [id]/
        FileAnalysisClient.tsx  # File details page with tabs
lib/
  services/
    field-mapping.ts        # Field mapping logic
    data-cleaning.ts        # Data cleaning with mapping integration
```

## Field Mapping System

### How It Works

1. **Original Headers Extraction**: When a CSV is uploaded, original column names are preserved
2. **Fuzzy Matching**: The system attempts to map original names to standard schema fields
3. **Confidence Levels**:
   - **Exact**: Perfect match (e.g., "fasting_blood_glucose" → "fasting_blood_glucose")
   - **High**: Strong substring match (e.g., "Blood_Glucose_mg_dL" → "fasting_blood_glucose")
   - **Low**: Weak match or fallback (e.g., "glucose" → "fasting_blood_glucose")

### Supported Field Mappings

The system recognizes 50+ field variations across categories:

#### Visit Information
- `visit_date`, `date`, `visitDate`, `encounter_date`, `appointment_date`
- `visit_type`, `visitType`, `encounter_type`, `visit_reason`

#### Vitals
- **Blood Pressure**: `bp_systolic`, `Blood_Pressure_Systolic`, `systolic_bp`, `sbp`
- **Heart Rate**: `heart_rate`, `pulse`, `Heart_Rate_bpm`, `hr`
- **Temperature**: `temperature`, `temp`, `body_temp`, `Temperature_F`
- **Weight/BMI**: `weight`, `body_weight`, `Weight_kg`, `bmi`, `body_mass_index`

#### Lab Results
- **Blood Glucose**: `fasting_blood_glucose`, `Blood_Glucose_mg_dL`, `glucose`, `FBG`
- **HbA1c**: `hba1c`, `HbA1c_%`, `a1c`, `glycated_hemoglobin`
- **Cholesterol**: `total_cholesterol`, `cholesterol`, `Total_Cholesterol_mg_dL`
- **Liver Function**: `alt`, `ALT_U_L`, `sgpt`, `ast`, `AST_U_L`

#### Medications
- `medications`, `current_medications`, `drugs`, `prescription`
- `medication_name`, `drug_name`
- `dosage`, `dose`, `medication_dose`

#### Clinical Notes
- `symptoms`, `complaints`, `chief_complaint`
- `diagnosis`, `diagnoses`, `condition`
- `notes`, `clinical_notes`, `provider_notes`

## Usage Example

### Basic Implementation

```tsx
import CSVTableView from '@/components/CSVTableView';

<CSVTableView
  data={medicalRecords}
  fileName="patient-data.csv"
  fieldMappings={cleaningMetadata.fieldMappings}
/>
```

### With Field Mapping Display

```tsx
{/* Show field mappings before table */}
{fieldMappings && fieldMappings.length > 0 && (
  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
    <h3 className="text-sm font-semibold mb-3">Field Mappings Applied</h3>
    <div className="grid grid-cols-3 gap-2">
      {fieldMappings.map((mapping, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span>{mapping.original}</span>
          <span>→</span>
          <span>{mapping.standard}</span>
          <span className={`badge-${mapping.confidence}`}>
            {mapping.confidence}
          </span>
        </div>
      ))}
    </div>
  </div>
)}

<CSVTableView data={data} fileName={fileName} fieldMappings={fieldMappings} />
```

## Component Props

### CSVTableView

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `MedicalRecord[]` | Yes | Array of medical records to display |
| `fileName` | `string` | Yes | Name of the source CSV file |
| `fieldMappings` | `FieldMapping[]` | No | Array of field mapping information |

### FieldMapping Interface

```typescript
interface FieldMapping {
  original: string;      // Original CSV column name
  standard: string;      // Standardized schema field name
  confidence: 'exact' | 'high' | 'low';  // Match confidence level
  category?: string;     // Field category (vitals, labs, etc.)
}
```

## User Interactions

### 1. Filtering by Text
```
Enter text in search box → filters all columns → updates displayed rows
```

### 2. Filtering by Category
```
Click category button → shows only relevant columns → updates table
```

### 3. Sorting Columns
```
Click column header → sort ascending
Click again → sort descending
Click third time → remove sort
```

### 4. Pagination
```
Use "Previous"/"Next" buttons or page numbers to navigate
Change items per page: 10/25/50/100
```

## API Integration

### File Upload with Cleaning

```typescript
// app/api/files/route.ts
const parseResult = await parseFile(buffer, fileName);
const originalHeaders = parseResult.headers;

const cleaningResult = await cleanMedicalCSVData(
  parseResult.data,
  {
    removeIncompleteRows: true,
    fillMissingValues: true,
    strictValidation: false,
    requiredFields: ['visit_date', 'fasting_blood_glucose', 'hba1c']
  },
  originalHeaders  // Pass original headers for mapping
);

// Store field mappings in metadata
metadata.cleaning.fieldMappings = cleaningResult.metadata.fieldMappings;
```

### Retrieving File with Mappings

```typescript
const file = await prisma.file.findUnique({
  where: { id: fileId },
  include: {
    medicalRecords: true,
    patient: true
  }
});

// Access field mappings
const mappings = file.metadata?.cleaning?.fieldMappings;
```

## Customization

### Adding New Field Mappings

Edit `/lib/services/field-mapping.ts`:

```typescript
export const FIELD_MAPPINGS: FieldMapping[] = [
  // Add your custom mapping
  {
    standard: 'my_custom_field',
    alternatives: [
      'Custom Field',
      'custom_field',
      'CF',
      'my field'
    ],
    category: 'vitals', // or 'labs', 'medications', etc.
    description: 'Description of what this field represents'
  },
  // ... existing mappings
];
```

### Customizing Table Appearance

The table uses Tailwind CSS classes and supports dark mode. Modify colors in `CSVTableView.tsx`:

```tsx
// Category colors
const categoryColors: Record<string, string> = {
  visit: 'text-blue-700 dark:text-blue-400',
  vitals: 'text-green-700 dark:text-green-400',
  labs: 'text-purple-700 dark:text-purple-400',
  medications: 'text-orange-700 dark:text-orange-400',
  clinical: 'text-red-700 dark:text-red-400',
  other: 'text-gray-700 dark:text-gray-400'
};
```

## Performance Considerations

### Large Datasets

The component handles large datasets efficiently:
- Pagination reduces DOM elements
- Memoization for expensive calculations
- Virtual scrolling not needed (pagination handles it)

### Optimization Tips

1. **Limit Initial Page Size**: Default to 10 records per page
2. **Lazy Load Mappings**: Only show field mappings for visible columns
3. **Debounce Search**: Add debouncing for search input if needed

## Troubleshooting

### Problem: Columns Not Displaying

**Solution**: Check that `medicalRecords` contains data with expected structure.

```typescript
// Verify data structure
console.log(medicalRecords[0]);
// Should have: { visitDate, vitals: {...}, labResults: {...} }
```

### Problem: Field Mappings Not Showing

**Solution**: Ensure cleaning metadata includes field mappings.

```typescript
// Check metadata structure
console.log(file.metadata?.cleaning?.fieldMappings);
// Should be array of { original, standard, confidence, category }
```

### Problem: Sorting Not Working

**Solution**: Verify column names match data structure.

```typescript
// Column names should match nested paths
'vitals.bp_systolic'  // Not just 'bp_systolic'
'labResults.hba1c'    // Not just 'hba1c'
```

### Problem: Empty Table

**Solution**: Check for filtering or category selection that excludes all rows.

```typescript
// Reset filters
setFilterText('');
setSelectedCategory('all');
```

## Testing

### Manual Testing Checklist

- [ ] Upload CSV with various column name formats
- [ ] Verify field mappings appear correctly
- [ ] Test search filtering across all columns
- [ ] Test category filtering for each category
- [ ] Test sorting (ascending, descending, none) for each column
- [ ] Test pagination (next, previous, page numbers)
- [ ] Test items per page selector (10, 25, 50, 100)
- [ ] Verify dark mode compatibility
- [ ] Test with empty dataset
- [ ] Test with single record
- [ ] Test with >1000 records

### Test CSV Formats

Create test CSVs with different column naming conventions:

**Example 1: Underscore Format**
```csv
visit_date,fasting_blood_glucose,hba1c,bp_systolic,bp_diastolic
2024-01-01,120,6.5,130,85
```

**Example 2: CamelCase Format**
```csv
visitDate,fastingBloodGlucose,hbA1c,bpSystolic,bpDiastolic
2024-01-01,120,6.5,130,85
```

**Example 3: Custom Format (Should Auto-Map)**
```csv
Date,Blood_Glucose_mg_dL,HbA1c_%,BP_Systolic,BP_Diastolic
2024-01-01,120,6.5,130,85
```

## Best Practices

1. **Always Include Original Headers**: Pass original headers to cleaning function
2. **Display Field Mappings**: Show users how their columns were mapped
3. **Validate Confidence Levels**: Review "low" confidence mappings
4. **Provide Manual Override**: Allow users to adjust mappings if needed (future feature)
5. **Document Custom Fields**: Keep field mapping documentation updated

## Future Enhancements

### Planned Features

1. **Manual Field Mapping UI**: Allow users to override automatic mappings
2. **Export Functionality**: Export filtered/sorted data to CSV
3. **Column Reordering**: Drag-and-drop column rearrangement
4. **Advanced Filters**: Date ranges, numeric ranges, multi-select
5. **Cell Editing**: Inline editing of medical records (with validation)
6. **Bulk Actions**: Select multiple rows for batch operations
7. **Column Visibility Toggle**: Show/hide specific columns
8. **Saved Views**: Save filter/sort preferences per user

### Enhancement Ideas

1. **Visual Charts**: Inline sparklines for numeric columns
2. **Data Validation Indicators**: Highlight values outside normal ranges
3. **Comparison Mode**: Side-by-side comparison of multiple records
4. **Template Mapping**: Save field mappings as templates for future uploads
5. **AI Suggestions**: AI-powered field mapping suggestions

## Related Documentation

- [Field Mapping System](./FIELD_MAPPING_GUIDE.md)
- [Data Cleaning Pipeline](./DATA_CLEANING_GUIDE.md)
- [Medical Schema](./lib/medical-data/schema.ts)
- [AI Reports Implementation](./AI_POWERED_REPORTS_GUIDE.md)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the test CSV formats
3. Verify field mapping configuration
4. Check browser console for errors
