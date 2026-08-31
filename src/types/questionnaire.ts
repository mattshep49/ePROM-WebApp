export interface Alert {
  flag: boolean;
  message: string;
}

export interface Option {
  value: number;
  text: string;
  alert?: Alert | null;
}

export interface BranchRule {
  operator: string;
  triggerValue: number;
  targetQuestion: string;
  action: string;
}

export interface Question {
  questionCode: string;
  questionNumber: string;
  questionText: string;
  section: string;
  scaleCode: string;
  responseType: string;
  mandatory: boolean;
  displayOrder: number;
  parentQuestionCode?: string | null;
  clinicalAlertCapable?: boolean;
  notes?: string;
  options: Option[];
  branchRules: BranchRule[];
}

export interface Questionnaire {
  questionnaireCode: string;
  questions: Question[];
}

export interface TriggeredAlert {
  questionCode: string;
  message: string;
  optionValue: number;
}