import { useEffect, useMemo, useState } from "react";

import QuestionnaireRenderer from "./components/QuestionnaireRenderer";
import AssessmentComplete from "./components/AssessmentComplete";

import { getAssessment } from "./services/assessmentService";
import { submitAssessment } from "./services/submissionService";

import onTxOhs from "./data/OnTxOHS.json";
import onTxSymptom from "./data/ontx_symptom.json";
import offTxOhs from "./data/OffTxOHS.json";
import offTxFactB from "./data/OFFTX_FACTB.json";

import hdftLogo from "./assets/trustlogo.png";

import type { Questionnaire } from "./types/questionnaire";

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

  const [allAnswers, setAllAnswers] =
    useState<Record<string, Answers>>({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [submissionError, setSubmissionError] =
    useState<string | null>(null);

  const [submissionPayload, setSubmissionPayload] =
    useState<SubmissionPayload | null>(null);

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

  const questionnaireMap = useMemo(
    () => ({
      ONTX_OHS: onTxOhs,
      ONTX_SYMPTOM: onTxSymptom,
      OFFTX_OHS: offTxOhs,
      OFFTX_FACTB: offTxFactB,
    }),
    []
  );

  const questionnaires = useMemo(() => {
    if (!assessment) {
      return [];
    }

    return assessment.questionnaires
      .map(
        (questionnaireCode) =>
          questionnaireMap[
            questionnaireCode.trim() as keyof typeof questionnaireMap
          ]
      )
      .filter(
        (questionnaire): questionnaire is Questionnaire =>
          Boolean(questionnaire)
      );
  }, [assessment, questionnaireMap]);

  function handleAnswersChange(
    questionnaireCode: string,
    answers: Answers
  ) {
    setAllAnswers((current) => ({
      ...current,
      [questionnaireCode]: answers,
    }));
  }

  async function handleSubmit() {
    if (!assessment || !token) {
      return;
    }

    const combinedAnswers = Object.assign(
      {},
      ...Object.values(allAnswers)
    ) as Answers;

    const missingQuestions = questionnaires.flatMap(
      (questionnaire) =>
        questionnaire.questions.filter(
          (question) =>
            question.mandatory &&
            combinedAnswers[question.questionCode] === undefined
        )
    );

    if (missingQuestions.length > 0) {
      const firstMissingQuestion =
        missingQuestions[0].questionCode;

      document
        .getElementById(firstMissingQuestion)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

      setSubmissionError(
        `Please complete ${missingQuestions.length} required question(s).`
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
        {hdftLogo}

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