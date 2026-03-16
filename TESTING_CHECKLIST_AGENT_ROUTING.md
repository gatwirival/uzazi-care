# ✅ Testing Checklist - Intelligent Agent Routing

## Pre-Testing Setup

- [ ] Development server running: `pnpm dev`
- [ ] Database connected and accessible
- [ ] At least one patient created in system
- [ ] At least one doctor account available
- [ ] DeepSeek API key configured in `.env`

## Test Suite 1: Basic Suggestion Flow

### Test 1.1: Diabetes Specialist Suggestion
- [ ] Navigate to `/dashboard/chat`
- [ ] Select a patient from dropdown
- [ ] Verify "General Doctor" is selected
- [ ] Type: "Patient has high blood sugar, frequent urination, and excessive thirst"
- [ ] Click "Send"
- [ ] **Expected**: Modal appears suggesting "Diabetes Specialist"
- [ ] **Expected**: Confidence score shown (should be 70%+)
- [ ] **Expected**: Detected symptoms displayed (frequent urination, excessive thirst)
- [ ] **Expected**: Keywords displayed (blood sugar)

### Test 1.2: Accept Suggestion
- [ ] Continue from Test 1.1
- [ ] Click "Switch to Diabetes Specialist"
- [ ] **Expected**: Modal closes
- [ ] **Expected**: System message appears: "🔄 Agent Switch: Connected to Dr. Diabetes Specialist..."
- [ ] **Expected**: Dropdown shows "Diabetes Specialist" selected
- [ ] **Expected**: AI response uses diabetes specialist knowledge

### Test 1.3: Decline Suggestion
- [ ] Repeat Test 1.1 steps
- [ ] Click "Continue with General Doctor"
- [ ] **Expected**: Modal closes
- [ ] **Expected**: No system message
- [ ] **Expected**: Dropdown still shows "General Doctor"
- [ ] **Expected**: AI response from general doctor

## Test Suite 2: Other Specialists

### Test 2.1: Cardiology Specialist
- [ ] Use General Doctor with patient selected
- [ ] Type: "Patient has chest pain, irregular heartbeat, and high blood pressure"
- [ ] **Expected**: Suggests Cardiology Specialist (❤️)
- [ ] **Expected**: Shows cardiac-related symptoms/keywords

### Test 2.2: Nephrology Specialist
- [ ] Use General Doctor with patient selected
- [ ] Type: "Creatinine is elevated, eGFR is declining, and patient has blood in urine"
- [ ] **Expected**: Suggests Nephrology Specialist (🫘)
- [ ] **Expected**: Shows kidney-related symptoms/keywords

### Test 2.3: Endocrinology Specialist
- [ ] Use General Doctor with patient selected
- [ ] Type: "Patient has thyroid problems, unexplained weight gain, and fatigue"
- [ ] **Expected**: Suggests Endocrinology Specialist (⚕️)
- [ ] **Expected**: Shows endocrine-related symptoms/keywords

## Test Suite 3: Edge Cases

### Test 3.1: No Patient Selected
- [ ] Navigate to chat
- [ ] Leave patient dropdown on "No patient selected"
- [ ] Type diabetes symptoms
- [ ] **Expected**: NO suggestion modal appears
- [ ] **Expected**: Message sends to General Doctor normally

### Test 3.2: Already Using Specialist
- [ ] Manually select "Diabetes Specialist" from dropdown
- [ ] Select a patient
- [ ] Type general symptoms
- [ ] **Expected**: NO suggestion modal appears
- [ ] **Expected**: Message sends to Diabetes Specialist

### Test 3.3: Generic Message (No Match)
- [ ] Use General Doctor with patient
- [ ] Type: "Hello, how are you?"
- [ ] **Expected**: NO suggestion modal
- [ ] **Expected**: Normal response from General Doctor

### Test 3.4: Low Confidence (Below Threshold)
- [ ] Use General Doctor with patient
- [ ] Type message with only 1 vague medical term
- [ ] **Expected**: Likely no suggestion (score < 2)
- [ ] **Expected**: If shown, confidence should be low

## Test Suite 4: Patient Context Integration

### Test 4.1: Patient with Existing Diabetes
**Setup**: Create patient with diabetes diagnosis in database
- [ ] Select this patient
- [ ] Use General Doctor
- [ ] Type: "Patient needs glucose monitoring advice"
- [ ] **Expected**: Higher confidence for Diabetes Specialist
- [ ] **Expected**: "Patient has existing conditions" shown in modal

### Test 4.2: Patient with Heart Disease
**Setup**: Create patient with cardiovascular diagnosis
- [ ] Select this patient
- [ ] Type mild cardiac symptoms
- [ ] **Expected**: Cardiology suggestion with boosted confidence
- [ ] **Expected**: Patient conditions shown in modal

## Test Suite 5: UI/UX Tests

### Test 5.1: Modal Appearance
- [ ] Trigger any suggestion
- [ ] **Check**: Modal has gradient header (blue-purple)
- [ ] **Check**: Agent icon displays (🩺, ❤️, etc.)
- [ ] **Check**: Confidence percentage shown
- [ ] **Check**: Progress bar matches percentage
- [ ] **Check**: Color coding: Green (70%+), Yellow (50-69%), Orange (30-49%)
- [ ] **Check**: Symptoms shown with red badges
- [ ] **Check**: Keywords shown with purple badges
- [ ] **Check**: Patient conditions shown with amber badges (if any)
- [ ] **Check**: Info notice (yellow banner) appears
- [ ] **Check**: Two buttons: "Continue" and "Switch"

### Test 5.2: Modal Interactions
- [ ] Trigger suggestion
- [ ] Click outside modal (on backdrop)
- [ ] **Expected**: Modal closes (declines suggestion)
- [ ] Trigger again
- [ ] Click X button in header
- [ ] **Expected**: Modal closes (declines suggestion)
- [ ] Trigger again
- [ ] Press ESC key
- [ ] **Expected**: Modal closes (declines suggestion)

### Test 5.3: Loading States
- [ ] Trigger suggestion
- [ ] Click "Switch to Specialist"
- [ ] **Check**: Button shows loading spinner
- [ ] **Check**: Button text changes to "Switching..."
- [ ] **Check**: Button disabled during transition
- [ ] **Check**: Modal closes after transition

### Test 5.4: System Messages
- [ ] Accept any suggestion
- [ ] **Check**: System message has gradient background
- [ ] **Check**: System message centered
- [ ] **Check**: Contains emoji (🔄)
- [ ] **Check**: Shows specialist name and specialty
- [ ] **Check**: Timestamp displayed

## Test Suite 6: Multi-Message Conversations

### Test 6.1: Suggestion After Several Messages
- [ ] Start conversation with General Doctor
- [ ] Send 2-3 general messages
- [ ] Then send message with specific symptoms
- [ ] **Expected**: Suggestion appears appropriately
- [ ] Accept suggestion
- [ ] **Expected**: Previous messages remain in chat
- [ ] **Expected**: Conversation continues with specialist

### Test 6.2: Multiple Suggestions in One Session
- [ ] Start with General Doctor
- [ ] Trigger diabetes suggestion → decline
- [ ] Later, type cardiac symptoms
- [ ] **Expected**: Can get cardiology suggestion
- [ ] **Expected**: Each suggestion independent

## Test Suite 7: Manual Agent Switching

### Test 7.1: Manual Override
- [ ] Use General Doctor
- [ ] Manually select "Diabetes Specialist" from dropdown
- [ ] **Expected**: No modal needed
- [ ] **Expected**: Next message goes to specialist
- [ ] **Expected**: No system message

### Test 7.2: Manual Switch Back
- [ ] After accepting specialist suggestion
- [ ] Manually select "General Doctor" from dropdown
- [ ] **Expected**: Switches back immediately
- [ ] **Expected**: Next message goes to General Doctor

## Test Suite 8: Error Handling

### Test 8.1: API Failure
- [ ] Temporarily disable API endpoint (or simulate failure)
- [ ] Type symptoms
- [ ] **Expected**: Graceful fallback to General Doctor
- [ ] **Expected**: No error shown to user
- [ ] **Expected**: Message still sends

### Test 8.2: Network Issues
- [ ] Start typing, then disconnect internet
- [ ] Try to send message
- [ ] **Expected**: Appropriate error message
- [ ] **Expected**: No crash

## Test Suite 9: Performance Tests

### Test 9.1: Response Time
- [ ] Trigger suggestion
- [ ] **Expected**: Modal appears within 500ms
- [ ] **Expected**: No noticeable lag

### Test 9.2: Large Conversation
- [ ] Have conversation with 20+ messages
- [ ] Trigger suggestion
- [ ] **Expected**: Works normally
- [ ] **Expected**: No performance degradation

## Test Suite 10: Mobile Responsiveness

### Test 10.1: Mobile View
- [ ] Open chat on mobile device or resize browser to mobile width
- [ ] Trigger suggestion
- [ ] **Expected**: Modal adapts to screen size
- [ ] **Expected**: All content readable
- [ ] **Expected**: Buttons accessible

## Test Suite 11: Dark Mode

### Test 11.1: Dark Mode Toggle
- [ ] Enable dark mode in system/browser
- [ ] Trigger suggestion
- [ ] **Check**: Modal readable in dark mode
- [ ] **Check**: Badges have proper contrast
- [ ] **Check**: System messages visible
- [ ] **Check**: No white backgrounds blinding

## Test Suite 12: Accessibility

### Test 12.1: Keyboard Navigation
- [ ] Trigger suggestion
- [ ] Use Tab key to navigate
- [ ] **Expected**: Can focus buttons
- [ ] Use Enter to activate
- [ ] **Expected**: Works correctly

### Test 12.2: Screen Reader
- [ ] Use screen reader
- [ ] Trigger suggestion
- [ ] **Expected**: Modal content announced
- [ ] **Expected**: Buttons have proper labels

## Final Checklist

- [ ] All 12 test suites completed
- [ ] No errors in browser console
- [ ] No errors in terminal/server logs
- [ ] All features working as expected
- [ ] UI looks good in all states
- [ ] Performance acceptable
- [ ] Ready for production

## Bug Tracking Template

If you find issues, document them here:

```
Bug #: ___
Severity: [ ] Critical  [ ] High  [ ] Medium  [ ] Low
Test: _______________
Steps to reproduce:
1. 
2. 
3. 

Expected: _______________
Actual: _______________
Error message (if any): _______________
Screenshot/video: _______________
```

---

## Quick Test Script (Automated)

For quick validation, run through this 5-minute test:

1. ✅ Basic diabetes suggestion → accept
2. ✅ Basic cardiac suggestion → decline  
3. ✅ No patient selected → no suggestion
4. ✅ Generic message → no suggestion
5. ✅ Manual agent switch → works
6. ✅ UI looks good
7. ✅ No console errors

**All green?** → Ready to go! 🚀
