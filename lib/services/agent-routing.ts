/**
 * Intelligent Agent Routing Service
 * Analyzes user messages and patient context to suggest appropriate specialist agents
 */

import { prisma } from '@/lib/db';

export interface AgentSuggestion {
  agentId: string;
  agentName: string;
  specialty: string;
  confidence: number;
  reason: string;
  keywords: string[];
  symptoms: string[];
  patientConditions?: string[];
  icon: string;
}

/**
 * Analyze user message and patient context to suggest appropriate specialist agent
 * This function detects symptoms, ailments, and medical keywords to recommend the best agent
 */
export async function suggestAgent(
  message: string,
  patientId?: string
): Promise<AgentSuggestion | null> {
  const messageLower = message.toLowerCase();
  
  // Define agent detection patterns with symptoms and icons
  const agentPatterns = {
    'menstrual-health': {
      name: 'Cycle & Period Guide',
      specialty: 'Menstrual Health',
      icon: '🌸',
      keywords: [
        'period', 'menstrual', 'menstruation', 'cycle', 'pms', 'cramps',
        'spotting', 'irregular period', 'heavy bleeding', 'light period',
        'ovulation', 'luteal', 'follicular', 'period pain', 'period late',
        'missed period', 'amenorrhea', 'dysmenorrhea', 'endometriosis', 'pcos',
      ],
      symptoms: [
        'period cramps', 'bloating', 'mood swings before period', 'breast tenderness',
        'pelvic pain', 'irregular cycles', 'heavy flow', 'spotting between periods',
        'painful periods', 'period headache', 'lower back pain during period',
      ],
      requiredCount: 1,
      weight: 2,
    },
    'pregnancy-care': {
      name: 'Pregnancy Care Companion',
      specialty: 'Pregnancy & Childbirth',
      icon: '🤰',
      keywords: [
        'pregnant', 'pregnancy', 'trimester', 'baby', 'fetal', 'fetus',
        'antenatal', 'prenatal', 'labour', 'labor', 'contractions', 'birth',
        'due date', 'weeks pregnant', 'morning sickness', 'ultrasound',
        'midwife', 'obstetrician', 'ob-gyn', 'caesarean', 'c-section',
      ],
      symptoms: [
        'morning sickness', 'nausea during pregnancy', 'pregnancy cramps',
        'fetal movement', 'swollen feet during pregnancy', 'back pain in pregnancy',
        'spotting during pregnancy', 'high blood pressure pregnancy',
        'gestational diabetes', 'preeclampsia signs',
      ],
      requiredCount: 1,
      weight: 2,
    },
    'postpartum-recovery': {
      name: 'Postpartum Recovery Guide',
      specialty: 'Postpartum Care',
      icon: '👶',
      keywords: [
        'postpartum', 'after birth', 'after delivery', 'breastfeeding',
        'newborn', 'baby blues', 'ppd', 'postnatal', 'lactation', 'nipple',
        'lochia', 'c-section recovery', 'episiotomy', 'perineal',
        'milk supply', 'latch', 'pumping breast milk',
      ],
      symptoms: [
        'postpartum depression', 'excessive crying after birth', 'low milk supply',
        'breastfeeding pain', 'wound pain after delivery', 'incontinence after birth',
        'fatigue after delivery', 'baby not latching', 'engorgement',
      ],
      requiredCount: 1,
      weight: 2,
    },
    'emergency-safety': {
      name: 'Emergency & Safety Guide',
      specialty: 'Emergency Triage',
      icon: '🚨',
      keywords: [
        'emergency', 'danger', 'severe', 'urgent', 'heavy bleeding',
        'unconscious', 'fit', 'seizure', 'eclampsia', 'collapse',
        'cannot breathe', 'chest pain', 'ectopic', 'miscarriage',
        'extreme pain', 'high fever', 'convulsion',
      ],
      symptoms: [
        'heavy uncontrolled bleeding', 'severe abdominal pain', 'fainting',
        'blurred vision in pregnancy', 'severe headache pregnancy', 'can\'t feel baby move',
        'high fever during pregnancy', 'leaking fluid before labour',
      ],
      requiredCount: 1,
      weight: 3,
    },
  };

  // Score each agent based on keywords and symptoms
  const scores: Record<string, { score: number; matchedKeywords: string[]; matchedSymptoms: string[] }> = {};

  for (const [agentId, pattern] of Object.entries(agentPatterns)) {
    const matchedKeywords: string[] = [];
    const matchedSymptoms: string[] = [];
    
    // Check for keyword matches
    for (const keyword of pattern.keywords) {
      if (messageLower.includes(keyword)) {
        matchedKeywords.push(keyword);
      }
    }

    // Check for symptom matches
    for (const symptom of pattern.symptoms) {
      if (messageLower.includes(symptom)) {
        matchedSymptoms.push(symptom);
      }
    }

    const totalMatches = matchedKeywords.length + matchedSymptoms.length;

    if (totalMatches >= pattern.requiredCount) {
      scores[agentId] = {
        score: (matchedKeywords.length * pattern.weight) + (matchedSymptoms.length * 1.5), // Symptoms weighted higher
        matchedKeywords,
        matchedSymptoms,
      };
    }
  }

  // If patient context is available, boost score based on diagnoses
  let patientConditions: string[] = [];

  if (patientId) {
    try {
      const diagnoses = await prisma.diagnosis.findMany({
        where: {
          MedicalRecord: {
            patientId,
          },
        },
        select: {
          description: true,
        },
      });

      patientConditions = diagnoses.map(d => d.description);
      const diagnosisText = patientConditions.join(' ').toLowerCase();

      // Boost menstrual-health if patient has cycle-related conditions
      if (/period|menstrual|pcos|endometriosis|cycle/i.test(diagnosisText)) {
        scores['menstrual-health'] = scores['menstrual-health'] || { score: 0, matchedKeywords: [], matchedSymptoms: [] };
        scores['menstrual-health'].score += 5;
        scores['menstrual-health'].matchedKeywords.push('existing menstrual condition');
      }

      // Boost pregnancy-care if patient has obstetric conditions
      if (/pregnan|trimester|antenatal|gestational/i.test(diagnosisText)) {
        scores['pregnancy-care'] = scores['pregnancy-care'] || { score: 0, matchedKeywords: [], matchedSymptoms: [] };
        scores['pregnancy-care'].score += 5;
        scores['pregnancy-care'].matchedKeywords.push('existing pregnancy condition');
      }

      // Boost postpartum if patient has postnatal conditions
      if (/postpartum|postnatal|breastfeed|ppd/i.test(diagnosisText)) {
        scores['postpartum-recovery'] = scores['postpartum-recovery'] || { score: 0, matchedKeywords: [], matchedSymptoms: [] };
        scores['postpartum-recovery'].score += 5;
        scores['postpartum-recovery'].matchedKeywords.push('existing postpartum condition');
      }

      // Boost emergency-safety if patient has high-risk conditions
      if (/eclampsia|preeclampsia|haemorrhage|hemorrhage|ectopic/i.test(diagnosisText)) {
        scores['emergency-safety'] = scores['emergency-safety'] || { score: 0, matchedKeywords: [], matchedSymptoms: [] };
        scores['emergency-safety'].score += 5;
        scores['emergency-safety'].matchedKeywords.push('existing high-risk condition');
      }
    } catch (error) {
      console.error('Error fetching patient diagnoses for agent suggestion:', error);
    }
  }

  // Find highest scoring agent
  let bestAgent: { id: string; score: number; keywords: string[]; symptoms: string[] } | null = null;
  
  for (const [agentId, data] of Object.entries(scores)) {
    if (!bestAgent || data.score > bestAgent.score) {
      bestAgent = {
        id: agentId,
        score: data.score,
        keywords: data.matchedKeywords,
        symptoms: data.matchedSymptoms,
      };
    }
  }

  // Only suggest if confidence is high enough
  if (bestAgent && bestAgent.score >= 2) {
    const pattern = agentPatterns[bestAgent.id as keyof typeof agentPatterns];
    const confidence = Math.min(bestAgent.score / 10, 0.95); // Cap at 95%

    // Build detailed reasoning
    let reason = '';
    if (bestAgent.symptoms.length > 0) {
      reason += `Detected symptoms: ${bestAgent.symptoms.slice(0, 3).join(', ')}. `;
    }
    if (bestAgent.keywords.length > 0) {
      reason += `Relevant keywords: ${bestAgent.keywords.slice(0, 3).join(', ')}. `;
    }
    if (patientConditions.length > 0) {
      reason += `Patient has existing conditions that align with this specialty.`;
    }

    return {
      agentId: bestAgent.id,
      agentName: pattern.name,
      specialty: pattern.specialty,
      confidence,
      reason: reason.trim(),
      keywords: bestAgent.keywords,
      symptoms: bestAgent.symptoms,
      patientConditions,
      icon: pattern.icon,
    };
  }

  return null;
}

/**
 * Log agent suggestion for analytics
 */
export async function logAgentSuggestion(
  chatSessionId: string,
  fromAgent: string,
  suggestion: AgentSuggestion,
  wasAccepted: boolean
): Promise<void> {
  try {
    // TODO: Implement agent suggestion logging when model is added to schema
    // For now, just log to console
    console.log('Agent suggestion:', {
      chatSessionId,
      fromAgent,
      toAgent: suggestion.agentId,
      reason: suggestion.reason,
      wasAccepted,
    });
  } catch (error) {
    console.error('Failed to log agent suggestion:', error);
  }
}

/**
 * Get doctor's fine-tuned knowledge for an agent
 */
export async function getAgentKnowledge(
  doctorId: string,
  agentType: string
): Promise<string[]> {
  try {
    const knowledge = await prisma.agentKnowledge.findMany({
      where: {
        doctorId,
        agentType,
      },
      orderBy: {
        priority: 'desc',
      },
    });

    return knowledge.map(k => k.knowledge);
  } catch (error) {
    console.error('Failed to fetch agent knowledge:', error);
    return [];
  }
}
