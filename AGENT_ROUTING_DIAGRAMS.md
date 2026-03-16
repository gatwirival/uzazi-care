# 🔄 Agent Routing Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     INTELLIGENT AGENT ROUTING SYSTEM                     │
└─────────────────────────────────────────────────────────────────────────┘

                           ┌──────────────────┐
                           │  Doctor Opens    │
                           │   Chat Page      │
                           └────────┬─────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │ Selects Patient  │
                           │  (Required!)     │
                           └────────┬─────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │ Uses General     │
                           │ Doctor (Default) │
                           └────────┬─────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │ Doctor Types     │
                           │ Symptoms/Message │
                           └────────┬─────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │ System Analyzes  │
                           │   Message        │
                           └────────┬─────────┘
                                    │
                ┌───────────────────┴───────────────────┐
                │                                       │
                ▼                                       ▼
    ┌────────────────────┐                 ┌────────────────────┐
    │ No Specialist      │                 │ Specialist Agent   │
    │ Needed             │                 │ Detected           │
    └──────┬─────────────┘                 └──────┬─────────────┘
           │                                       │
           ▼                                       ▼
    ┌────────────────────┐                 ┌────────────────────┐
    │ Continue with      │                 │ Calculate          │
    │ General Doctor     │                 │ Confidence Score   │
    └────────────────────┘                 └──────┬─────────────┘
                                                   │
                                                   ▼
                                          ┌────────────────────┐
                                          │ Score >= 2?        │
                                          └──────┬─────────────┘
                                                 │
                               ┌─────────────────┴─────────────────┐
                               │                                   │
                               ▼                                   ▼
                      ┌─────────────────┐              ┌─────────────────┐
                      │ Yes: Show       │              │ No: Continue    │
                      │ Suggestion      │              │ with General    │
                      │ Modal           │              │ Doctor          │
                      └────────┬────────┘              └─────────────────┘
                               │
                               ▼
                      ┌─────────────────┐
                      │ Beautiful Modal │
                      │ - Agent info    │
                      │ - Confidence    │
                      │ - Symptoms      │
                      │ - Reasoning     │
                      └────────┬────────┘
                               │
                               ▼
                      ┌─────────────────┐
                      │ Doctor Reviews  │
                      │ Suggestion      │
                      └────────┬────────┘
                               │
               ┌───────────────┴───────────────┐
               │                               │
               ▼                               ▼
    ┌──────────────────────┐        ┌──────────────────────┐
    │ ACCEPT               │        │ DECLINE              │
    │ "Switch to           │        │ "Continue with       │
    │  Specialist"         │        │  General Doctor"     │
    └──────────┬───────────┘        └──────────┬───────────┘
               │                               │
               ▼                               ▼
    ┌──────────────────────┐        ┌──────────────────────┐
    │ 1. Close Modal       │        │ 1. Close Modal       │
    │ 2. Switch Agent      │        │ 2. Keep General      │
    │ 3. Add System Msg    │        │    Doctor            │
    │ 4. Send to Specialist│        │ 3. Send to General   │
    └──────────┬───────────┘        └──────────┬───────────┘
               │                               │
               └───────────────┬───────────────┘
                               │
                               ▼
                      ┌─────────────────┐
                      │ Conversation     │
                      │ Continues        │
                      └─────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW                                       │
└─────────────────────────────────────────────────────────────────────────┘

 User Message
     │
     ▼
┌──────────────────────────────────┐
│  POST /api/chat/suggest-agent    │ ◄── If using General Doctor
│  - message: string               │     with patient selected
│  - patientId: string             │
└───────────┬──────────────────────┘
            │
            ▼
┌──────────────────────────────────┐
│  suggestAgent()                  │
│  /lib/services/agent-routing.ts  │
│  ┌────────────────────────────┐  │
│  │ 1. Extract keywords        │  │
│  │ 2. Detect symptoms         │  │
│  │ 3. Fetch patient diagnoses │  │
│  │ 4. Score each agent        │  │
│  │ 5. Calculate confidence    │  │
│  │ 6. Generate reasoning      │  │
│  └────────────────────────────┘  │
└───────────┬──────────────────────┘
            │
            ▼
┌──────────────────────────────────┐
│  AgentSuggestion Object          │
│  {                               │
│    agentId: string               │
│    agentName: string             │
│    specialty: string             │
│    confidence: number            │
│    reason: string                │
│    keywords: string[]            │
│    symptoms: string[]            │
│    patientConditions: string[]   │
│    icon: string                  │
│  }                               │
└───────────┬──────────────────────┘
            │
            ▼
┌──────────────────────────────────┐
│  Frontend (Chat Page)            │
│  - Sets agentSuggestion state    │
│  - Shows modal                   │
│  - Waits for user decision       │
└───────────┬──────────────────────┘
            │
            ▼
      User Decision
            │
    ┌───────┴────────┐
    ▼                ▼
 ACCEPT          DECLINE
    │                │
    ▼                ▼
┌─────────┐    ┌──────────┐
│ Switch  │    │ Continue │
│ Agent   │    │ w/ Gen   │
└────┬────┘    └────┬─────┘
     │              │
     └──────┬───────┘
            │
            ▼
┌──────────────────────────────────┐
│  POST /api/chat                  │
│  - messages: Message[]           │
│  - agentId: string               │
│  - patientId: string             │
└───────────┬──────────────────────┘
            │
            ▼
┌──────────────────────────────────┐
│  DeepSeek API Call               │
│  - with agent system prompt      │
│  - with patient context          │
│  - streams response back         │
└──────────────────────────────────┘
```

---

## 🎯 Decision Points

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DECISION MATRIX                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┬──────────────────┬────────────────────────────────┐
│   Current Agent     │  Patient Selected│          Action                │
├─────────────────────┼──────────────────┼────────────────────────────────┤
│ General Doctor      │       YES        │ Analyze → Suggest if matched  │
│ General Doctor      │       NO         │ No suggestion (continue)       │
│ Specialist          │       YES/NO     │ No suggestion (already focused)│
└─────────────────────┴──────────────────┴────────────────────────────────┘

┌─────────────────────┬──────────────────┬────────────────────────────────┐
│   Confidence        │  Visual Indicator│       User Action              │
├─────────────────────┼──────────────────┼────────────────────────────────┤
│ 70-95%              │   🟢 Green       │ Highly recommended - accept    │
│ 50-69%              │   🟡 Yellow      │ Moderately recommended         │
│ 30-49%              │   🟠 Orange      │ Weak recommendation            │
│ < 30%               │   No suggestion  │ Not shown to user              │
└─────────────────────┴──────────────────┴────────────────────────────────┘
```

---

## 🏗️ Component Architecture

```
/app/dashboard/chat/page.tsx (Main Chat Component)
│
├── State Management
│   ├── agents: Agent[]
│   ├── selectedAgent: string
│   ├── messages: Message[]
│   ├── agentSuggestion: AgentSuggestion | null
│   ├── showSuggestionModal: boolean
│   └── pendingUserMessage: Message | null
│
├── Functions
│   ├── handleSendMessage() ──────┐
│   │                              ├──► Check for suggestions
│   │                              └──► sendMessageToAgent()
│   ├── sendMessageToAgent() ─────┐
│   │                              └──► API call to /api/chat
│   ├── handleAcceptSuggestion() ─┐
│   │                              ├──► Switch agent
│   │                              ├──► Add system message
│   │                              └──► Send pending message
│   └── handleDeclineSuggestion()─┐
│                                  └──► Continue with current agent
│
└── Render
    ├── <AgentSuggestionModal />
    ├── Agent selector dropdown
    ├── Message list
    │   ├── User messages
    │   ├── Assistant messages
    │   └── System messages (agent switches)
    └── Input form
```

---

## 🔢 Scoring Algorithm

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SCORING FORMULA                                  │
└─────────────────────────────────────────────────────────────────────────┘

Agent Score = (Keyword Matches × 2.0) + 
              (Symptom Matches × 1.5) + 
              (Patient Condition Bonus: 0 or 5)

Example: Diabetes Specialist
├── Keywords detected: ["diabetes", "glucose", "HbA1c"] 
│   → 3 keywords × 2.0 = 6 points
├── Symptoms detected: ["frequent urination", "thirst"]
│   → 2 symptoms × 1.5 = 3 points  
└── Patient has diabetes diagnosis
    → +5 bonus points

Total Score: 6 + 3 + 5 = 14 points
Confidence: min(14/10, 0.95) = 95%

Threshold: Score >= 2 to show suggestion
```

---

## 📱 UI States

```
STATE 1: Initial (No suggestion)
┌─────────────────────────────────────┐
│  Chat Interface                     │
│  ┌───────────────────────────────┐  │
│  │ General Doctor Selected       │  │
│  └───────────────────────────────┘  │
│  [Message input]                    │
└─────────────────────────────────────┘

STATE 2: Suggestion Modal Active
┌─────────────────────────────────────┐
│  [Darkened Background]              │
│  ┌─────────────────────────────┐   │
│  │  AGENT SUGGESTION MODAL     │   │
│  │  ┌───────────────────────┐  │   │
│  │  │ 🩺 Diabetes Specialist│  │   │
│  │  │ Confidence: 85%       │  │   │
│  │  │ ─────────────────     │  │   │
│  │  │ Detected symptoms...  │  │   │
│  │  │ [Accept] [Decline]    │  │   │
│  │  └───────────────────────┘  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘

STATE 3: Agent Switched (System Message)
┌─────────────────────────────────────┐
│  Chat Interface                     │
│  ┌───────────────────────────────┐  │
│  │ Diabetes Specialist Selected  │  │
│  └───────────────────────────────┘  │
│  ╔═══════════════════════════════╗  │
│  ║ 🔄 Agent Switch: Connected to ║  │
│  ║    Dr. Diabetes Specialist    ║  │
│  ╚═══════════════════════════════╝  │
│  [Conversation continues...]        │
└─────────────────────────────────────┘
```

---

## 🎭 Agent Specializations

```
┌───────────────────────────────────────────────────────────────────────┐
│                      AGENT DECISION TREE                              │
└───────────────────────────────────────────────────────────────────────┘

                            User Message
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
           Metabolic        Cardiac          Renal
           Keywords?        Keywords?        Keywords?
                │                │                │
                ▼                ▼                ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │  Diabetes?   │ │ Cardiology?  │ │ Nephrology?  │
        │  Endocrine?  │ │              │ │              │
        └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
               │                │                │
    ┌──────────┴──────┐        │                │
    ▼                 ▼         ▼                ▼
┌─────────┐    ┌──────────┐ ┌──────────┐ ┌──────────┐
│Diabetes │    │Endocrine │ │Cardiology│ │Nephrology│
│Specialist│   │Specialist│ │Specialist│ │Specialist│
└─────────┘    └──────────┘ └──────────┘ └──────────┘
```

This visual representation helps understand the complete workflow! 🎨
