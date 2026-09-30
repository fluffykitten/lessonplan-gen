export interface IcmIndicators {
  faithful: boolean;
  adabAkhlaq: boolean;
  independence: boolean;
  intelligence: boolean;
  leadership: boolean;
  explanation: string;
}

export interface SequenceOfTeaching {
  exposure: boolean;
  miniLesson: boolean;
  groupPractice: boolean;
  independentPractice: boolean;
  assessment: boolean;
  details?: string;
}

export interface Differentiation {
  content: boolean;
  process: boolean;
  product: boolean;
  readinessInterestProfile: boolean;
  explanation: string;
}

export interface ActivityStep {
  timingMinutes: number;
  description: string;
  resources: string;
}

export interface SessionActivities {
  beginning: ActivityStep;
  middle: ActivityStep;
  end: ActivityStep;
}

export interface LessonSession {
  sessionNumber: number;
  sessionTitle: string;
  durationText: string; // e.g. "2 x 40 Minutes" or "1 x 40 Minutes"
  totalMinutes: number; // e.g. 80 or 40
  microLearningObjectives: string; // Anderson-Krathwohl taxonomy code & objective
  icmIndicators: IcmIndicators;
  sequenceOfTeaching: SequenceOfTeaching;
  differentiation: Differentiation;
  vocabulary: string;
  essentialQuestion: string;
  contextTriggerQuestion: string;
  planActivities: SessionActivities;
  reflectionEvaluation: string;
  nextPlanFollowUp: string;
  plannedAssessment?: string;
}

export interface LessonMetadata {
  academicYear: string;
  subject: string;
  teacherName: string;
  gradeSemester: string;
  topicOfDiscussion: string;
  periodWeek: string;
  chapterSubChapter: string;
  principalName: string;
  curriculumVpName: string;
  locationDate: string;
}

export interface LessonPlanData {
  metadata: LessonMetadata;
  learningOutcomesCP: string;
  learningObjectivesTP: string;
  sessions: LessonSession[];
}

export type InputMode = 'structured' | 'natural';

export type GradePreset = 'grade10' | 'grade11' | 'custom';

export interface TeacherFormInput {
  mode: InputMode;
  apiKey: string;
  selectedModel: string;
  gradePreset: GradePreset;
  // Metadata
  academicYear: string;
  subject: string;
  teacherName: string;
  gradeSemester: string;
  topicOfDiscussion: string;
  periodWeek: string;
  chapterSubChapter: string;
  // Mode 1 fields (Structured CP / TP)
  learningOutcomesCP: string;
  learningObjectivesTP: string;
  structuredNotes?: string; // Optional teacher pedagogical directives, learning flow, materials, assessments
  // Mode 2 fields (Teacher Notes)
  roughNotes: string;
  // Custom durations if GradePreset === 'custom'
  customDurations: [number, number, number];
  // Signatures
  principalName: string;
  curriculumVpName: string;
  locationDate: string;
}
