import { useEffect, useState } from "react";

import QuestionnaireRenderer from "./components/QuestionnaireRenderer";
import AssessmentComplete from "./components/AssessmentComplete";

import { getAssessment, getQuestionnaires } from "./services/assessmentService";
import { submitAssessment } from "./services/submissionService";

import hdftLogo from "./assets/trustlogo.png";

import type { Questionnaire, TriggeredAlert } from "./types/questionnaire";

type AnswerValue = string | number;
type Answers = Record<string, AnswerValue>;

type Assessment = {
  assessmentToken: string;
  assessmentId: string;
  questionnaireSet: string;
  questionnaires: string[];
};

type SubmissionPayload = {
  assessmentToken: string;
  assessmentCode: string;
  questionnaireSet: string;
  submittedDate: string;
  responses: Array<{
    questionCode: string;
    responseValue: AnswerValue;
  }>;
};

function App() {
  const [assessment, setAssessment] =
    useState<Assessment | null>(null);

  type QuestionnaireState = {
  answers: Answers;
  visibleRequiredQuestionCodes: string[];
  clinicalAlerts: TriggeredAlert[];
};

const [questionnaireStates, setQuestionnaireStates] =
  useState<Record<string, QuestionnaireState>>({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [submissionError, setSubmissionError] =
    useState<string | null>(null);

  const [submissionPayload, setSubmissionPayload] =
    useState<SubmissionPayload | null>(null);

  const [questionnaires, setQuestionnaires] =
    useState<Questionnaire[]>([]);

  const token = new URLSearchParams(
    window.location.search
  ).get("token");

  useEffect(() => {
    async function loadAssessment() {
      if (!token) {
        setLoadError("No assessment token was supplied.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError(null);

        const result = await getAssessment(token);

        if (!result.assessmentId) {
          setLoadError(
            result.message ??
              result.error ??
              "The assessment could not be found."
          );

          return;
        }

        setAssessment(result as Assessment);

        // Fetch questionnaires from API
        try {
          const questionnairesData = await getQuestionnaires(
            result.questionnaires
          );

          // Convert to array format
          const questionnairesArray = result.questionnaires
            .map(
              (code: string) => questionnairesData[code]
            )
            .filter((q: Questionnaire | undefined) => Boolean(q));

          setQuestionnaires(questionnairesArray);
        } catch (questionsError) {
          console.warn(
            "Failed to fetch questionnaires from API",
            questionsError
          );
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "The assessment could not be loaded.";

        if (
          message.toLowerCase().includes("already completed") ||
          message.toLowerCase().includes("already submitted")
        ) {
          setLoadError(
            "This assessment has already been completed. No further action is required."
          );
        } else {
          setLoadError(
            "The assessment could not be loaded. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    }

    void loadAssessment();
  }, [token]);



  function handleAnswersChange(
    questionnaireCode: string,
    state: QuestionnaireState
  ) {
    setQuestionnaireStates((current) => ({
      ...current,
      [questionnaireCode]: state,
    }));
  }

  async function handleSubmit() {
    if (!assessment || !token) {
      return;
    }

    const combinedAnswers = Object.assign(
  {},
  ...Object.values(questionnaireStates).map(
    (state) => state.answers
  )
) as Answers;

const visibleRequiredQuestionCodes =
  Object.values(questionnaireStates).flatMap(
    (state) => state.visibleRequiredQuestionCodes
  );

const missingQuestionCodes =
  visibleRequiredQuestionCodes.filter(
    (questionCode) =>
      combinedAnswers[questionCode] === undefined ||
      combinedAnswers[questionCode] === ""
  );

    if (missingQuestionCodes.length > 0) {
      const firstMissingQuestion =
        missingQuestionCodes[0]; 

      document
        .getElementById(firstMissingQuestion)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

      setSubmissionError(
  `Please complete ${missingQuestionCodes.length} required question(s).`
);

      return;
    }

    const payload: SubmissionPayload = {
      assessmentToken: token,
      assessmentCode: assessment.assessmentId,
      questionnaireSet: assessment.questionnaireSet,
      submittedDate: new Date().toISOString(),

      responses: Object.entries(combinedAnswers).map(
        ([questionCode, responseValue]) => ({
          questionCode,
          responseValue,
        })
      ),
    };

    try {
      setSubmitting(true);
      setSubmissionError(null);

      await submitAssessment(payload);

      localStorage.removeItem("eprom-assessment");

      setSubmissionPayload(payload);
    } catch (error) {
      console.error("Assessment submission failed:", error);

      setSubmissionError(
        "The assessment could not be submitted. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading assessment...
      </div>
    );
  }

  if (!assessment || loadError) {
    const alreadyCompleted =
      loadError?.toLowerCase().includes("already been completed");

    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>
          {alreadyCompleted
            ? "Assessment Already Submitted"
            : "Invalid Assessment Link"}
        </h1>

        <p>
          {loadError ?? "The assessment could not be found."}
        </p>
      </div>
    );
  }

  if (submissionPayload) {
    return (
      <AssessmentComplete
        assessmentToken={submissionPayload.assessmentToken}
        assessmentCode={submissionPayload.questionnaireSet}
        submittedDate={submissionPayload.submittedDate}
        responses={submissionPayload.responses}
        questionnaires={questionnaires}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
      }}
    >
      <header
        style={{
          background: "#ffffff",
          padding: "20px",
          textAlign: "center",
          borderBottom: "1px solid #d8dde0",
        }}
      >
        <img
          src={hdftLogo}
          alt="Trust Logo"
          style={{ maxWidth: "200px", marginBottom: "20px" }}
        />

        <p style={{ margin: "12px 0 0" }}>
          Assessment reference: {token}
        </p>
      </header>

      <div style={{ padding: "40px" }}>
        {questionnaires.map((questionnaire) => (
          <QuestionnaireRenderer
            key={questionnaire.questionnaireCode}
            questionnaire={questionnaire}
            onAnswersChange={handleAnswersChange}
          />
        ))}

        {submissionError && (
          <div
            style={{
              maxWidth: "900px",
              margin: "20px auto",
              padding: "16px",
              background: "#fef0f0",
              border: "2px solid #d5281b",
              borderRadius: "12px",
              color: "#d5281b",
              fontWeight: 600,
            }}
          >
            {submissionError}
          </div>
        )}

        <div
          style={{
            maxWidth: "900px",
            margin: "40px auto",
            textAlign: "center",
          }}
        >
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting}
            style={{
              background: submitting ? "#768692" : "#005eb8",
              color: "#ffffff",
              border: "none",
              padding: "18px 40px",
              borderRadius: "12px",
              fontSize: "20px",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting
              ? "Submitting assessment..."
              : "Submit complete assessment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;