import type { LessonPlanData, TeacherFormInput } from '../types/lessonPlan';

const SYSTEM_INSTRUCTION = `You are an expert Cambridge & SPK (Satuan Pendidikan Kerjasama) curriculum designer and senior master teacher at Insan Cendekia Madani (ICM) High School in South Tangerang, Indonesia.
Your task is to generate an authentic, comprehensive, rigorous, and highly structured weekly lesson plan formatted strictly according to the Insan Cendekia Madani High School Lesson Planning standards.

Adhere strictly to the following 10 pedagogical rules, quality standards, and exemplar:

========================================
1. SESSIONS, DURATIONS & TIMING ARITHMETIC SELF-CHECK
========================================
- The week consists of exactly THREE (3) sessions.
  * For Grade 10 default: Session 1 (2 x 40m = 80 min), Session 2 (2 x 40m = 80 min), Session 3 (2 x 40m = 80 min). Total 240 minutes.
  * For Grade 11 default: Session 1 (2 x 40m = 80 min), Session 2 (2 x 40m = 80 min), Session 3 (1 x 40m = 40 min). Total 200 minutes.
  * Or respect custom session durations if specified by the teacher.
- MANDATORY ARITHMETIC RULE & SELF-CHECK:
  In each session, verify before finalizing:
    beginning.timingMinutes + middle.timingMinutes + end.timingMinutes === totalMinutes
  Never allow a timing mismatch. If there is a calculation discrepancy, adjust the middle timing to make the sum exactly equal to totalMinutes.
  Typical timing distributions:
  * For an 80-minute session: Beginning ≈ 15m (15-20%), Middle ≈ 50m (60-65%), End ≈ 15m (15-20%).
  * For a 40-minute session: Beginning ≈ 8-10m, Middle ≈ 22-25m, End ≈ 7-8m.

========================================
2. ANDERSON-KRATHWOHL TAXONOMY (AKT) 2D MATRIX & STRICT TWO-PART CODES
========================================
- The AKT 2D Matrix maps the Knowledge Dimension against the Cognitive Process Dimension:
  * Knowledge Dimensions:
    - F = Factual Knowledge (terminology, specific details, elements)
    - C = Conceptual Knowledge (classifications, categories, principles, generalizations, theories, models)
    - P = Procedural Knowledge (subject-specific skills, techniques, methods, criteria for using procedures)
    - M = Metacognitive Knowledge (strategic knowledge, cognitive tasks, contextual conditions, self-knowledge)
  * Cognitive Process Dimensions (C1 to C6):
    - C1 = Remember (retrieving, recognizing, recalling relevant knowledge from long-term memory)
    - C2 = Understand (interpreting, exemplifying, classifying, summarizing, inferring, comparing, explaining)
    - C3 = Apply (executing, implementing procedures)
    - C4 = Analyze (differentiating, organizing, attributing relationships)
    - C5 = Evaluate (checking, critiquing, judging based on criteria and standards)
    - C6 = Create (generating, planning, producing, synthesizing new structures)

- TWO-PART CODE NOTATION RULE (CRITICAL DISAMBIGUATION):
  Every Micro Learning Objective MUST use an unambiguous two-part code formed by concatenating:
    Part 1: Knowledge Dimension letter — F (Factual), C (Conceptual), P (Procedural), or M (Metacognitive).
    Part 2: Cognitive Level — C1, C2, C3, C4, C5, or C6.
  Concatenate them directly WITHOUT any separator: FC1, CC2, PC3, CC4, PC5, MC6.
  * CLARIFICATION ON "CC": When the Knowledge Dimension is Conceptual ("C"), the code begins with "CC" (e.g., CC2 for Conceptual + Understand; CC4 for Conceptual + Analyze; CC6 for Conceptual + Create). This repeated "C" is intentional and mathematically correct.
  * NEVER abbreviate to just "C4", "C2", or "P3" — always include BOTH the Knowledge letter and the Cognitive code.
  * Format for Micro Learning Objectives:
    "[Code]: [Cognitive Verb] + [Knowledge Dimension] - [Detailed, observable objective description]"
    Examples:
    - FC1: Remember + Factual - Recall common oxidation numbers of Group I, II, and transition metals and state the conservation of charge.
    - CC2: Understand + Conceptual - Explain how electrostatic attraction between cations and anions results in an orderly giant lattice structure.
    - PC3: Apply + Procedural - Construct accurate dot-and-cross diagrams showing single, double, and coordinate covalent bonds.
    - CC4: Analyze + Conceptual - Differentiate between electrical conductivity mechanisms in molten ionic compounds versus delocalized metallic matrices.
    - PC5: Evaluate + Procedural - Evaluate titration data sets to detect parallax and volume reading anomalies, calculating percentage experimental error.
    - MC6: Create + Metacognitive - Design a revised experimental inquiry protocol based on self-reflection of source contamination errors.

- OBJECTIVES QUANTITY & PROGRESSION:
  * Quantity: Exactly TWO (2) Micro Learning Objectives per session, each addressing a distinct cell in the AKT matrix. Exception: Session 3 may include a 3rd objective if a Metacognitive (M) reflection or synthesis objective is appropriate.
  * Progression across the week:
    - Session 1 (Foundational Knowledge & Concepts): Focus on FC1, CC1, CC2, PC2.
    - Session 2 (Procedural Practice & Conceptual Analysis): Focus on PC3, CC3, CC4, PC4.
    - Session 3 (Mastery, Synthesis, Evaluation): Culminating outcomes using CC4, PC4, PC5, CC5, MC5, CC6, PC6, or MC6.

========================================
3. INSAN CENDEKIA MADANI (ICM) CHARACTER INDICATORS (STRICT SELECTION MANDATE)
========================================
- Indicator checkboxes available in template: Faithful, Adab Akhlaq, Independence, Intelligence, Leadership.
- STRICT SELECTION RULE: You MUST ONLY CHOOSE from: Independence, Intelligence, and/or Leadership.
  * ALWAYS set "faithful": false and "adabAkhlaq": false. NEVER check Faithful or Adab Akhlaq.
  * For each session, select 1 to 3 indicators strictly from:
    - Independence: Autonomous investigation, individual problem-solving, self-directed learning, perseverance.
    - Intelligence: Critical thinking, conceptual clarity, analytical reasoning, scientific/empirical rigor.
    - Leadership: Peer-coaching, collaborative responsibility, constructive feedback, team facilitation.
- QUALITY STANDARDS:
  * Must describe a SPECIFIC MOMENT in the lesson where the chosen indicator is demonstrated or cultivated, WHO initiates it (teacher or student), and WHAT is said or done.
  * ✅ GOOD: "At minute 35 during the ionic bonding modeling activity, teacher fosters student autonomy (Independence) and scientific reasoning (Intelligence): students independently deduce the empirical formula of 4 binary compounds using element tiles, while the teacher prompts them to explain the logical necessity of achieving full valence octets."
  * ✅ GOOD: "At minute 40 during trio problem solving, teacher highlights peer-coaching adab (Leadership): 'When your teammate makes an error with lone pairs, guide them with questions rather than simply writing the answer.' Students practice collaborative leadership and patience."
  * ❌ BAD / FORBIDDEN: Selecting Faithful or Adab Akhlaq, or writing generic platitudes.

========================================
4. WEEKLY NARRATIVE ARC & CROSS-SESSION COHERENCE
========================================
- Design the 3 sessions as a continuous pedagogical storyline:
  * Session 1 Hook / Context: Introduce a real-world paradox, visual demo, or trigger question that cannot be fully explained until Session 3.
  * Session 2 Warm-up: The first 3-5 minutes of Session 2 MUST explicitly bridge back to Session 1, addressing a common formative misconception or reviewing foundational prerequisite skills.
  * Session 3 Culmination: Directly builds upon the procedural skills practiced in Session 2 to conduct hands-on testing, comparative evaluation, or creative synthesis.
  * Essential Questions: Create a 3-stage inquiry arc across the week (Observation/Phenomenon → Microscopic Mechanism → Macroscopic Application/Evaluation).

========================================
5. SEQUENCE OF TEACHING & DIFFERENTIATION
========================================
- Sequence of Teaching checkboxes: Exposure, Mini lesson (guided practice), Group practice/Collaborative Workshop, Independent practice, Formative / Summative assessment.
  Select all checkboxes that genuinely occur in the session, and provide a clear flow summary in the "details" string.
- Differentiation checkboxes: Content, Process, Product, Readiness / Interest / Learning profile.
  * MANDATORY: In at least ONE session per week, provide detailed, actionable differentiated instructions (e.g., tiered scaffolds for foundation learners, open-ended extensions for advanced students).
  * For sessions where differentiation is not actively planned, write "N/A for this session."

========================================
6. CLASSROOM REALITY & ACTIVITY QUALITY RULES
========================================
- In planActivities (beginning, middle, end):
  * Describe physical, observable actions: manipulating physical or molecular kits, cutting cards, sketching on individual mini-whiteboards, conducting hot-water bath tests, rotating in pairs.
  * Include teacher questions in quotes: e.g., Teacher asks: "Why can calcium bond with two chlorines while sodium bonds with only one?"
  * Detail student collaboration structures: specify whether students work in think-pair-share dyads, heterogeneous trios for peer coaching, or individual timed sprints.
  * Avoid vague generic filler like "Teacher explains the concept" or "Students discuss". Instead specify the exact mechanism (e.g., interactive whiteboard modeling, step-by-step worked example, guided inquiry worksheet).
  * Explicitly specify realistic teaching aids, apparatus, digital simulations (PhET), or physical worksheets under resources.

========================================
7. VOCABULARY & TERMINOLOGY WITH CONCISE DEFINITIONS
========================================
- In the vocabulary field, do NOT merely output a comma-separated list of words.
- Provide 6 to 10 key terms, each paired with a CONCISE, curriculum-aligned definition or contextual explanation:
  Format: "Term — definition/context; Term — definition/context; ..."
  Example: "Ion — an atom or group of atoms that has gained or lost electrons, acquiring an electrical charge; Cation — a positively charged ion formed by electron loss; Anion — a negatively charged ion formed by electron gain; Lattice — a regular, repeating three-dimensional arrangement of atoms, ions, or molecules."

========================================
8. PLANNED ASSESSMENT WITH SAMPLE TASKS & RUBRIC CRITERIA
========================================
- In plannedAssessment:
  * State the assessment type: Formative or Summative.
  * Provide 1-2 concrete sample questions, calculation prompts, or diagram tasks.
  * Explicitly specify which Micro LO code is being measured (e.g., "Measures CC2 & PC3").
  * Include concise success criteria or marking guidance (e.g., "Full marks (3 pts): Correct cation and anion charges shown, valence electron transfer arrows drawn, empirical formula stated. Partial (1-2 pts): Correct formula but charges or arrows missing.").

========================================
9. ANTICIPATORY REFLECTION & EVALUATION FRAMEWORK
========================================
- In reflectionEvaluation, write a FORWARD-LOOKING diagnostic and monitoring framework (do NOT write in past tense as if the lesson already finished):
  * (1) Anticipated student misconceptions to actively monitor during guided/independent tasks.
  * (2) Formative checkpoint moment during the session (e.g., "Check mini-whiteboards at minute 35 during the second worked example").
  * (3) Contingency plan for struggling students and challenge extensions for fast finishers.
- In nextPlanFollowUp, specify actionable preparation, remediation, or preview steps for the subsequent session.

========================================
10. GOLD-STANDARD FEW-SHOT EXEMPLAR (SESSION 1)
========================================
Use this exact quality standard and structure when producing each session:

{
  "sessionNumber": 1,
  "sessionTitle": "Ionic Bonding & Electron Transfer Dynamics",
  "durationText": "2 x 40 Minutes",
  "totalMinutes": 80,
  "microLearningObjectives": "FC1: Remember + Factual - Recall typical valence electron counts and ion charges for Groups I, II, VI, and VII, stating the octet rule of stability.\\nCC2: Understand + Conceptual - Explain how cations and anions form via electron transfer between metals and non-metals to establish stable noble gas configurations, resulting in strong electrostatic lattice attractions.",
  "icmIndicators": {
    "faithful": false,
    "adabAkhlaq": false,
    "independence": true,
    "intelligence": true,
    "leadership": false,
    "explanation": "At minute 35 during the ionic bonding modeling activity, the teacher fosters student autonomy (Independence) and scientific reasoning (Intelligence): students independently deduce the empirical formula of 4 binary compounds using element tiles, while the teacher prompts them to explain the logical necessity of achieving full valence octets."
  },
  "sequenceOfTeaching": {
    "exposure": true,
    "miniLesson": true,
    "groupPractice": true,
    "independentPractice": false,
    "assessment": true,
    "details": "Phenomenon video demo -> Interactive whiteboard Bohr modeling -> Pair card-manipulation workshop -> Formative exit ticket."
  },
  "differentiation": {
    "content": true,
    "process": true,
    "product": false,
    "readinessInterestProfile": true,
    "explanation": "Tiered Scaffolding: Foundation learners receive color-coded element cards with physical counters representing valence electrons to physically transfer; advanced learners calculate empirical formulas and predict structures for polyatomic ternary salts (e.g., Fe2(SO4)3, Al(NO3)3)."
  },
  "vocabulary": "Ion — an atom or molecule carrying a net electrical charge due to the loss or gain of electrons; Cation — a positively charged ion produced when a metal atom loses valence electrons (e.g., Na⁺); Anion — a negatively charged ion produced when a non-metal atom gains electrons (e.g., Cl⁻); Electrostatic Attraction — the non-directional coulombic force binding oppositely charged ions into a lattice; Octet Rule — the chemical principle that atoms bond to achieve 8 valence electrons mimicking noble gases.",
  "essentialQuestion": "How does an atom's microscopic drive to achieve electronic stability govern the macroscopic properties of everyday substances like table salt?",
  "contextTriggerQuestion": "Why does metallic sodium (which explodes in water) combined with toxic chlorine gas create sodium chloride (table salt), an indispensable mineral required for human nerve transmission?",
  "planActivities": {
    "beginning": {
      "timingMinutes": 15,
      "description": "Teacher plays a 60-second video of elemental sodium reacting vigorously with chlorine gas inside an illuminated gas jar. Teacher displays coarse Himalayan rock salt crystals under a digital visualizer and asks the Context Trigger Question. Students engage in a 2-minute Turn-and-Talk in pairs, and teacher cold-calls 3 student pairs to share hypotheses. Teacher outlines the session's two Micro LOs on the board.",
      "resources": "Sodium + chlorine gas reaction video clip, rock salt specimens, digital visualizer document camera, projection slides."
    },
    "middle": {
      "timingMinutes": 50,
      "description": "[Minutes 16-30] Teacher demonstrates electron transfer for NaCl and MgO using magnetic Bohr discs on the board, emphasizing electron loss vs electron gain. Teacher checks understanding using mini-whiteboards: 'Show me the Lewis symbol for a sulfide ion with brackets and charge.' [Minutes 31-45] Students work in pairs with element tile cards to model electron transfers for 4 progressive binary compounds: LiF, CaO, MgCl2, and Al2O3. Teacher circulates targeting pairs struggling with 1:2 and 2:3 valence stoichiometry. [Minutes 46-50] Teacher brings class together to analyze why calcium requires two chloride ions, highlighting charge neutrality.",
      "resources": "Magnetic Bohr atom whiteboard boards, laminated element tile sets with valence counters, student guided worksheet WS 3.1, individual mini-whiteboards and dry-erase markers."
    },
    "end": {
      "timingMinutes": 15,
      "description": "Students independently complete a silent Formative Exit Ticket slip. Teacher conducts the 2-minute Ta'awun and Sunnatullah reflection wrap-up, and collects all slips at the door to diagnose readiness for covalent bonding in Session 2.",
      "resources": "Formative Exit Ticket slips 3.1, collection tray."
    }
  },
  "reflectionEvaluation": "Anticipate that 20-25% of students will confuse subscript numbers with ionic charges (e.g., writing MgCl2 instead of recognizing Mg²⁺ and two Cl⁻ ions). Checkpoint: Inspect whiteboard responses at minute 28. Contingency: Pair struggling students with peer coaches and provide pre-printed Bohr scaffold frames; provide ternary polyatomic extension problems for fast finishers.",
  "nextPlanFollowUp": "Review MgCl2 and Al2O3 dot-and-cross representation in a 4-minute opening warm-up during Session 2 before introducing electron sharing in covalent molecules.",
  "plannedAssessment": "Formative: Exit Ticket slip with 2 items. Item 1 (Measures FC1): State the ion symbol and charge for Potassium (Group I) and Oxygen (Group VI). Item 2 (Measures CC2): Draw the electron transfer diagram for Magnesium Chloride (MgCl2) showing outer shells and resulting bracketed ions with charges. Success criteria: Full credit (4 pts) requires correct ion charges (+2, -1) and two Cl ions clearly receiving one electron each from Mg; Partial credit (2 pts) if charges are correct but electron movement arrows are omitted."
}

========================================
CRITICAL: Return ONLY valid raw JSON conforming strictly to the requested schema. No conversational markdown wrappers outside standard JSON.`;

export async function generateLessonPlanWithGemini(
  input: TeacherFormInput,
  onProgress?: (status: string) => void
): Promise<LessonPlanData> {
  if (!input.apiKey || input.apiKey.trim() === '') {
    throw new Error('Please enter your Google Gemini API Key.');
  }

  let currentModel = (input.selectedModel || 'gemini-3.5-flash-lite')
    .replace(/^models\//, '')
    .trim();
  if (
    currentModel === 'gemini-2.5-flash' ||
    currentModel === 'gemini-1.5-flash' ||
    currentModel === 'gemini-2.0-flash' ||
    currentModel === 'gemini-1.5-flash-8b'
  ) {
    currentModel = 'gemini-3.5-flash-lite';
  } else if (currentModel === 'gemini-2.5-pro' || currentModel === 'gemini-1.5-pro') {
    currentModel = 'gemini-3.6-flash';
  }

  // Determine durations based on updated rules:
  // Grade 10: 80 - 80 - 80
  // Grade 11: 80 - 80 - 40
  let d1 = 80;
  let d2 = 80;
  let d3 = 80; // Grade 10 default is 80 min!
  if (input.gradePreset === 'grade11') {
    d3 = 40; // Grade 11 Session 3 is 40 min!
  } else if (input.gradePreset === 'custom' && input.customDurations) {
    d1 = input.customDurations[0] || 80;
    d2 = input.customDurations[1] || 80;
    d3 = input.customDurations[2] || 80;
  }

  const userPrompt =
    input.mode === 'natural'
      ? `Generate a complete 3-session ICM High School lesson plan based on the following teacher's notes and ideas:

TEACHER NOTES & DESCRIPTION:
"""
${input.roughNotes}
"""

TEACHER & COURSE CONTEXT:
- Subject: ${input.subject || 'As inferred from notes'}
- Topic of Discussion: ${input.topicOfDiscussion || 'Infer from teacher notes'}
- Period / Week: ${input.periodWeek || 'Infer from teacher notes'}
- Chapter / Sub-Chapter: ${input.chapterSubChapter || 'Infer from teacher notes'}
- Grade / Semester: ${input.gradeSemester || (input.gradePreset === 'grade11' ? 'Grade 11 / Semester 1' : 'Grade 10 / Semester 1')}
- Teacher's Name: ${input.teacherName || 'Subject Teacher'}
- Academic Year: ${input.academicYear || '2026/2027'}
- High School Principal: ${input.principalName || 'Chabib Mustofa S.Pd.I, M.Pd'}
- Curriculum Vice Principal: ${input.curriculumVpName || 'Nur Intan Kumalasari M.Pd'}
- Location & Date: ${input.locationDate || 'South Tangerang, September 30, 2026'}
- Session 1 Duration: ${d1} minutes (${d1 === 80 ? '2 x 40 Minutes' : `${d1} Minutes`})
- Session 2 Duration: ${d2} minutes (${d2 === 80 ? '2 x 40 Minutes' : `${d2} Minutes`})
- Session 3 Duration: ${d3} minutes (${d3 === 80 ? '2 x 40 Minutes' : d3 === 40 ? '1 x 40 Minutes' : `${d3} Minutes`})

KEY QUALITY INSTRUCTIONS:
1. Micro LOs: Exactly 2 per session using strict two-part AKT codes (e.g., FC1, CC2, PC3, CC4, PC5, MC6).
2. ICM Indicators: Choose ONLY from Independence, Intelligence, and/or Leadership. Always set faithful: false and adabAkhlaq: false.
3. Timing Verification: Ensure beginning + middle + end minutes in each session sum up EXACTLY to that session's total minutes (${d1}, ${d2}, ${d3}).
4. Vocabulary: Provide concise definitions for each term ("Term — definition/context; ...").
5. Planned Assessment: Include concrete sample question/task, Micro LO alignment, and rubric success criteria.
6. Reflection: Write an anticipatory, forward-looking diagnostic framework (anticipated misconceptions, checkpoints, contingencies).
7. Weekly Arc: Create cross-session bridges (Session 2 warm-up bridges Session 1; Session 3 culminates).
8. Infer and flesh out all missing metadata (Topic of Discussion, Chapter/Sub-Chapter, Capaian Pembelajaran / CP, and Anderson-Krathwohl TP) intelligently based on the teacher's thoughts.`
      : `Generate a complete 3-session ICM High School lesson plan with the following syllabus information:

METADATA:
- Subject: ${input.subject}
- Teacher's Name: ${input.teacherName}
- Grade / Semester: ${input.gradeSemester}
- Topic of Discussion: ${input.topicOfDiscussion}
- Period / Week: ${input.periodWeek}
- Chapter / Sub-Chapter: ${input.chapterSubChapter}
- Academic Year: ${input.academicYear}
- High School Principal: ${input.principalName || 'Chabib Mustofa S.Pd.I, M.Pd'}
- Curriculum Vice Principal: ${input.curriculumVpName || 'Nur Intan Kumalasari M.Pd'}
- Location & Date: ${input.locationDate || 'South Tangerang, September 30, 2026'}

LEARNING OUTCOMES & OBJECTIVES:
- Capaian Pembelajaran (CP): ${input.learningOutcomesCP}
- Learning Objectives (TP): ${input.learningObjectivesTP}
${
  input.structuredNotes && input.structuredNotes.trim()
    ? `
TEACHER'S FLOW & PEDAGOGICAL INSTRUCTIONS (HIGH PRIORITY):
"""
${input.structuredNotes.trim()}
"""
(CRITICAL: The teacher has provided explicit directives above. You MUST incorporate these specific learning flows, required materials/resources, experiments/activities, summative/formative assessments, and pedagogical guidelines directly into the session activities, resources, and assessments!)
`
    : ''
}
SESSION DURATIONS:
- Session 1: ${d1} minutes (${d1 === 80 ? '2 x 40 Minutes' : `${d1} Minutes`})
- Session 2: ${d2} minutes (${d2 === 80 ? '2 x 40 Minutes' : `${d2} Minutes`})
- Session 3: ${d3} minutes (${d3 === 80 ? '2 x 40 Minutes' : d3 === 40 ? '1 x 40 Minutes' : `${d3} Minutes`})

KEY QUALITY INSTRUCTIONS:
1. Micro LOs: Exactly 2 per session using strict two-part AKT codes (e.g., FC1, CC2, PC3, CC4, PC5, MC6).
2. ICM Indicators: Choose ONLY from Independence, Intelligence, and/or Leadership. Always set faithful: false and adabAkhlaq: false.
3. Timing Verification: Ensure beginning + middle + end minutes in each session sum up EXACTLY to that session's total minutes (${d1}, ${d2}, ${d3}).
4. Vocabulary: Provide concise definitions for each term ("Term — definition/context; ...").
5. Planned Assessment: Include concrete sample question/task, Micro LO alignment, and rubric success criteria. If the teacher specified a summative or formative task, implement it faithfully.
6. Reflection: Write an anticipatory, forward-looking diagnostic framework (anticipated misconceptions, checkpoints, contingencies).
7. Weekly Arc: Create cross-session bridges (Session 2 warm-up bridges Session 1; Session 3 culminates).
8. Teacher's Directives: Strictly honor and integrate the teacher's flow, materials, activities, and assessment directives whenever provided above.
`;

  const jsonSchema = {
    type: 'OBJECT',
    properties: {
      metadata: {
        type: 'OBJECT',
        properties: {
          academicYear: { type: 'STRING' },
          subject: { type: 'STRING' },
          teacherName: { type: 'STRING' },
          gradeSemester: { type: 'STRING' },
          topicOfDiscussion: { type: 'STRING' },
          periodWeek: { type: 'STRING' },
          chapterSubChapter: { type: 'STRING' },
          principalName: { type: 'STRING' },
          curriculumVpName: { type: 'STRING' },
          locationDate: { type: 'STRING' },
        },
        required: [
          'academicYear',
          'subject',
          'teacherName',
          'gradeSemester',
          'topicOfDiscussion',
          'periodWeek',
          'chapterSubChapter',
          'principalName',
          'curriculumVpName',
          'locationDate',
        ],
      },
      learningOutcomesCP: { type: 'STRING' },
      learningObjectivesTP: { type: 'STRING' },
      sessions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            sessionNumber: { type: 'INTEGER' },
            sessionTitle: { type: 'STRING' },
            durationText: { type: 'STRING' },
            totalMinutes: { type: 'INTEGER' },
            microLearningObjectives: { type: 'STRING' },
            icmIndicators: {
              type: 'OBJECT',
              properties: {
                faithful: { type: 'BOOLEAN' },
                adabAkhlaq: { type: 'BOOLEAN' },
                independence: { type: 'BOOLEAN' },
                intelligence: { type: 'BOOLEAN' },
                leadership: { type: 'BOOLEAN' },
                explanation: { type: 'STRING' },
              },
              required: [
                'faithful',
                'adabAkhlaq',
                'independence',
                'intelligence',
                'leadership',
                'explanation',
              ],
            },
            sequenceOfTeaching: {
              type: 'OBJECT',
              properties: {
                exposure: { type: 'BOOLEAN' },
                miniLesson: { type: 'BOOLEAN' },
                groupPractice: { type: 'BOOLEAN' },
                independentPractice: { type: 'BOOLEAN' },
                assessment: { type: 'BOOLEAN' },
                details: { type: 'STRING' },
              },
              required: [
                'exposure',
                'miniLesson',
                'groupPractice',
                'independentPractice',
                'assessment',
              ],
            },
            differentiation: {
              type: 'OBJECT',
              properties: {
                content: { type: 'BOOLEAN' },
                process: { type: 'BOOLEAN' },
                product: { type: 'BOOLEAN' },
                readinessInterestProfile: { type: 'BOOLEAN' },
                explanation: { type: 'STRING' },
              },
              required: [
                'content',
                'process',
                'product',
                'readinessInterestProfile',
                'explanation',
              ],
            },
            vocabulary: { type: 'STRING' },
            essentialQuestion: { type: 'STRING' },
            contextTriggerQuestion: { type: 'STRING' },
            planActivities: {
              type: 'OBJECT',
              properties: {
                beginning: {
                  type: 'OBJECT',
                  properties: {
                    timingMinutes: { type: 'INTEGER' },
                    description: { type: 'STRING' },
                    resources: { type: 'STRING' },
                  },
                  required: ['timingMinutes', 'description', 'resources'],
                },
                middle: {
                  type: 'OBJECT',
                  properties: {
                    timingMinutes: { type: 'INTEGER' },
                    description: { type: 'STRING' },
                    resources: { type: 'STRING' },
                  },
                  required: ['timingMinutes', 'description', 'resources'],
                },
                end: {
                  type: 'OBJECT',
                  properties: {
                    timingMinutes: { type: 'INTEGER' },
                    description: { type: 'STRING' },
                    resources: { type: 'STRING' },
                  },
                  required: ['timingMinutes', 'description', 'resources'],
                },
              },
              required: ['beginning', 'middle', 'end'],
            },
            reflectionEvaluation: { type: 'STRING' },
            nextPlanFollowUp: { type: 'STRING' },
            plannedAssessment: { type: 'STRING' },
          },
          required: [
            'sessionNumber',
            'sessionTitle',
            'durationText',
            'totalMinutes',
            'microLearningObjectives',
            'icmIndicators',
            'sequenceOfTeaching',
            'differentiation',
            'vocabulary',
            'essentialQuestion',
            'contextTriggerQuestion',
            'planActivities',
            'reflectionEvaluation',
            'nextPlanFollowUp',
            'plannedAssessment',
          ],
        },
      },
    },
    required: ['metadata', 'learningOutcomesCP', 'learningObjectivesTP', 'sessions'],
  };

  // Resilient execution with backoff, schema optimization, and fallback models
  let textOutput = '';
  const maxAttempts = 3;
  let attempt = 0;
  let delayMs = 1500;
  let usedFallbackModel = false;

  onProgress?.(`Contacting Google Gemini with model "${currentModel}"...`);

  while (attempt < maxAttempts) {
    attempt++;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${encodeURIComponent(
      input.apiKey.trim()
    )}`;

    // On attempt 1, use full schema. On overloaded retries, drop responseSchema to relieve Google grammar constraint bottleneck
    const useSchema = attempt === 1;

    const payload: any = {
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json',
        ...(useSchema ? { responseSchema: jsonSchema } : {}),
      },
    };

    try {
      if (attempt > 1) {
        onProgress?.(`Sending request to "${currentModel}" (attempt ${attempt}/${maxAttempts})...`);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        textOutput = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (textOutput) break;
      }

      let errMessage = `HTTP ${response.status} ${response.statusText}`;
      try {
        const errData = await response.json();
        if (errData?.error?.message) {
          errMessage = errData.error.message;
        }
      } catch {
        // ignore
      }

      const is429QuotaOrRateLimit =
        response.status === 429 ||
        errMessage.toLowerCase().includes('resource has been exhausted') ||
        errMessage.toLowerCase().includes('quota') ||
        errMessage.toLowerCase().includes('rate limit');

      const is503Overloaded =
        response.status === 503 ||
        response.status === 500 ||
        errMessage.toLowerCase().includes('overloaded') ||
        errMessage.toLowerCase().includes('busy') ||
        errMessage.toLowerCase().includes('capacity') ||
        errMessage.toLowerCase().includes('unavailable');

      if (is429QuotaOrRateLimit) {
        if (attempt < maxAttempts) {
          const waitSec = ((delayMs + 2000) / 1000).toFixed(1);
          onProgress?.(`Rate limit reached (HTTP 429). Waiting ${waitSec}s to clear per-minute quota (attempt ${attempt + 1}/${maxAttempts})...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs + 2000));
          delayMs *= 2;
          continue;
        } else {
          throw new Error(
            `Google API Rate Limit Exceeded (HTTP 429 / Quota Exhausted). Your API key has temporarily exceeded its requests-per-minute or daily quota on Google AI Studio. Please wait 1-2 minutes before retrying, or create a fresh free key at https://aistudio.google.com/apikey.`
          );
        }
      }

      if (is503Overloaded) {
        if (attempt < maxAttempts) {
          // If a model is busy, automatically switch to ultra-resilient gemini-3.5-flash-lite or gemini-3.6-flash
          if (attempt === 2 && currentModel !== 'gemini-3.5-flash-lite' && !usedFallbackModel) {
            currentModel = 'gemini-3.5-flash-lite';
            usedFallbackModel = true;
            onProgress?.(`Google servers busy with "${input.selectedModel}". Switching to gemini-3.5-flash-lite for ultra-high availability...`);
          } else if (attempt === 2 && currentModel === 'gemini-3.5-flash-lite' && !usedFallbackModel) {
            currentModel = 'gemini-3.6-flash';
            usedFallbackModel = true;
            onProgress?.(`Google servers busy with gemini-3.5-flash-lite. Switching to gemini-3.6-flash...`);
          } else {
            const waitSec = ((delayMs + Math.random() * 400) / 1000).toFixed(1);
            onProgress?.(`Google servers are busy with "${currentModel}". Retrying in ${waitSec}s (attempt ${attempt + 1}/${maxAttempts})...`);
          }

          await new Promise((resolve) => setTimeout(resolve, delayMs + Math.random() * 400));
          delayMs *= 2;
          continue;
        } else {
          throw new Error(
            `Google Gemini servers are currently overloaded for "${currentModel}" (HTTP 503). Try selecting "gemini-3.5-flash-lite" (most resilient) or waiting 30–60 seconds.`
          );
        }
      }

      if (response.status === 404) {
        throw new Error(
          `Model "${currentModel}" was not found (HTTP 404). Note that older models like "gemini-pro" or "gemini-1.0-pro" were discontinued by Google. Please select "gemini-1.5-flash" or "gemini-2.0-flash".`
        );
      }

      throw new Error(`Gemini API error (${response.status}): ${errMessage}`);
    } catch (err: any) {
      if (
        err.message &&
        (err.message.includes('overloaded') ||
          err.message.includes('Rate Limit') ||
          err.message.includes('Google Gemini servers') ||
          err.message.includes('Google API Rate Limit') ||
          err.message.includes('404'))
      ) {
        throw err;
      }
      if (attempt >= maxAttempts) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      delayMs *= 2;
    }
  }

  if (!textOutput) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }

  try {
    const parsedData: LessonPlanData = JSON.parse(textOutput);

    // Apply user inputs explicitly so AI generation NEVER overwrites user-specified metadata
    parsedData.metadata.principalName =
      input.principalName?.trim() ||
      parsedData.metadata.principalName?.trim() ||
      'Chabib Mustofa S.Pd.I, M.Pd';

    parsedData.metadata.curriculumVpName =
      input.curriculumVpName?.trim() ||
      parsedData.metadata.curriculumVpName?.trim() ||
      'Nur Intan Kumalasari M.Pd';

    parsedData.metadata.locationDate =
      input.locationDate?.trim() ||
      parsedData.metadata.locationDate?.trim() ||
      'South Tangerang, September 30, 2026';

    if (input.teacherName?.trim()) {
      parsedData.metadata.teacherName = input.teacherName.trim();
    }
    if (input.academicYear?.trim()) {
      parsedData.metadata.academicYear = input.academicYear.trim();
    }
    if (input.subject?.trim()) {
      parsedData.metadata.subject = input.subject.trim();
    }
    if (input.gradeSemester?.trim()) {
      parsedData.metadata.gradeSemester = input.gradeSemester.trim();
    }
    if (input.periodWeek?.trim()) {
      parsedData.metadata.periodWeek = input.periodWeek.trim();
    }
    if (input.chapterSubChapter?.trim()) {
      parsedData.metadata.chapterSubChapter = input.chapterSubChapter.trim();
    }
    if (input.topicOfDiscussion?.trim()) {
      parsedData.metadata.topicOfDiscussion = input.topicOfDiscussion.trim();
    }
    // Safety check & timing arithmetic reconciliation
    if (Array.isArray(parsedData.sessions)) {
      parsedData.sessions.forEach((session, idx) => {
        const expectedTotal = idx === 0 ? d1 : idx === 1 ? d2 : d3;
        session.totalMinutes = expectedTotal;
        if (!session.durationText) {
          session.durationText =
            expectedTotal === 80
              ? '2 x 40 Minutes'
              : expectedTotal === 40
              ? '1 x 40 Minutes'
              : `${expectedTotal} Minutes`;
        }

        // Enforce ICM indicators constraint: only choose Independence, Intelligence, and/or Leadership
        if (session.icmIndicators) {
          session.icmIndicators.faithful = false;
          session.icmIndicators.adabAkhlaq = false;
        }

        if (session.planActivities?.beginning && session.planActivities?.middle && session.planActivities?.end) {
          const beg = Number(session.planActivities.beginning.timingMinutes) || 0;
          const end = Number(session.planActivities.end.timingMinutes) || 0;
          const mid = Number(session.planActivities.middle.timingMinutes) || 0;
          if (beg + mid + end !== expectedTotal) {
            // Reconcile by adjusting middle activity
            const remaining = expectedTotal - (beg + end);
            session.planActivities.middle.timingMinutes = Math.max(10, remaining);
          }
        }
      });
    }

    return parsedData;
  } catch (parseError: any) {
    // If json has markdown wrappers
    const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    const data: LessonPlanData = JSON.parse(cleaned);
    if (Array.isArray(data.sessions)) {
      data.sessions.forEach((session, idx) => {
        const expectedTotal = idx === 0 ? d1 : idx === 1 ? d2 : d3;
        session.totalMinutes = expectedTotal;
        if (session.icmIndicators) {
          session.icmIndicators.faithful = false;
          session.icmIndicators.adabAkhlaq = false;
        }
        if (session.planActivities?.beginning && session.planActivities?.middle && session.planActivities?.end) {
          const beg = Number(session.planActivities.beginning.timingMinutes) || 0;
          const end = Number(session.planActivities.end.timingMinutes) || 0;
          const mid = Number(session.planActivities.middle.timingMinutes) || 0;
          if (beg + mid + end !== expectedTotal) {
            session.planActivities.middle.timingMinutes = Math.max(10, expectedTotal - (beg + end));
          }
        }
      });
    }
    return data;
  }
}
