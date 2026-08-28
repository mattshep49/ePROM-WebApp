export interface Option {
  value: number;
  text: string;
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
  options: Option[];
  branchRules: BranchRule[];
}

export interface Questionnaire {
  questionnaireCode: string;
  questions: Question[];
}