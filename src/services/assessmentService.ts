export interface AssessmentResponse {
  assessmentToken: string;
  assessmentCode: string;
  submittedDate: string;
  responses: QuestionResponse[];
}

export interface QuestionResponse {
  questionCode: string;
  responseValue: string | number;
}
