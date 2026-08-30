import trustLogo from "../assets/trustlogo.png";
import type { Questionnaire } from "../types/questionnaire";

type ResponseItem = {
  questionCode: string;
  responseValue: string | number;
};

type Props = {
  assessmentToken: string;
  assessmentCode: string;
  submittedDate: string;
  responses: ResponseItem[];
  questionnaires: Questionnaire[];
};

export default function AssessmentComplete({
  assessmentToken,
  assessmentCode,
  submittedDate,
  responses,
  questionnaires,
}: Props) {

  const responseLookup = Object.fromEntries(
    responses.map((r) => [
      r.questionCode,
      r.responseValue,
    ])
  );

  // Get max scale value based on scale code
  const getScaleMax = (scaleCode: string): number => {
    if (scaleCode === "VAS_0_100") return 100;
    if (scaleCode.includes("_5")) return 4; // INTERFERENCE_5, FREQUENCY_5, SEVERITY_5, etc.
    if (scaleCode.includes("_4")) return 3; // PAIN_SEVERITY_4, etc.
    if (scaleCode === "YES_NO" || scaleCode === "YES_NO_NA") return 1;
    return 4; // Default
  };

  // Check if question has numeric response
  const isNumericQuestion = (question: any): boolean => {
    return question.responseType === "choice" || question.responseType === "integer";
  };

  // Group responses by questionnaire for display
  const groupedQuestions = questionnaires.map((questionnaire) => ({
    questionnaire,
    questions: questionnaire.questions
      .filter((q) => responseLookup[q.questionCode] !== undefined)
      .sort((a, b) => a.displayOrder - b.displayOrder),
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <img
            src={trustLogo}
            alt="Trust Logo"
            style={{ maxWidth: "200px", marginBottom: "20px" }}
          />

          <div
            style={{
              background: "#00703c",
              color: "white",
              padding: "15px",
              borderRadius: "12px",
              marginBottom: "25px",
              fontWeight: 600,
            }}
          >
            ✓ Your assessment has been submitted successfully
          </div>

          <h1>Assessment Submitted</h1>

          <p>
            Thank you for completing your assessment.
          </p>
        </div>

        <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>
          Submission Details
        </h3>

        <div
          style={{
            background: "#f9fafb",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "40px",
            border: "1px solid #e5e7eb",
          }}
        >
          <p style={{ marginBottom: "15px" }}>
            <strong>Assessment Reference:</strong>{" "}
            <span style={{ fontFamily: "monospace", color: "#005eb8" }}>
              {assessmentToken}
            </span>
          </p>

          <p style={{ marginBottom: "15px" }}>
            <strong>Assessment Type:</strong>{" "}
            {assessmentCode}
          </p>

          <p style={{ marginBottom: "0" }}>
            <strong>Submitted:</strong>{" "}
            {submittedDate}
          </p>
        </div>

        {groupedQuestions.map((group) => {
          const hasResponses = group.questions.length > 0;
          if (!hasResponses) return null;

          return (
            <div key={group.questionnaire.questionnaireCode}>
              <h2 style={{ marginTop: "50px", marginBottom: "30px" }}>
                {group.questionnaire.questionnaireCode === "ONTX_OHS" ||
                group.questionnaire.questionnaireCode === "OFFTX_OHS"
                  ? "Overall Health Today"
                  : group.questionnaire.questionnaireCode}
              </h2>

              {group.questionnaire.questionnaireCode === "ONTX_OHS" ||
              group.questionnaire.questionnaireCode === "OFFTX_OHS" ? (
                // Special rendering for OHS questions (0-100 scale)
                group.questions.map((question) => (
                  <div
                    key={question.questionCode}
                    style={{
                      background: "#f0f7ff",
                      padding: "30px",
                      borderRadius: "12px",
                      marginBottom: "50px",
                      border: "2px solid #005eb8",
                    }}
                  >
                    <div style={{ marginBottom: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "15px",
                        }}
                      >
                        <strong style={{ fontSize: "16px" }}>
                          Health Score
                        </strong>
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#005eb8",
                          }}
                        >
                          {responseLookup[question.questionCode]} / 100
                        </span>
                      </div>

                      <div
                        style={{
                          height: "30px",
                          background: "#e5e5e5",
                          borderRadius: "12px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${responseLookup[question.questionCode]}%`,
                            height: "100%",
                            borderRadius: "12px",
                            background:
                              Number(responseLookup[question.questionCode]) >= 70
                                ? "#28a745"
                                : Number(responseLookup[question.questionCode]) >= 40
                                  ? "#ffc107"
                                  : "#dc3545",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ fontSize: "14px", color: "#666" }}>
                      0 is the worst health you can imagine, 100 is the best
                    </div>
                  </div>
                ))
              ) : (
                // Standard bar rendering for other questions
                <div style={{ marginBottom: "50px" }}>
                  {group.questions
                    .filter(isNumericQuestion)
                    .map((question) => {
                      const value = Number(responseLookup[question.questionCode]);
                      const scaleMax = getScaleMax(question.scaleCode);
                      const percentage = (value / scaleMax) * 100;

                      return (
                        <div
                          key={question.questionCode}
                          style={{ marginBottom: "25px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            <strong style={{ fontSize: "15px" }}>
                              {question.questionText}
                            </strong>
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: 600,
                                color: "#005eb8",
                              }}
                            >
                              {value} / {scaleMax}
                            </span>
                          </div>
                          <div
                            style={{
                              height: "24px",
                              background: "#e5e5e5",
                              borderRadius: "12px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${percentage}%`,
                                height: "100%",
                                borderRadius: "12px",
                                background: "#005eb8",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}

        <h2 style={{ marginTop: "50px", marginBottom: "30px" }}>
          Additional Comments
        </h2>

        <div
          style={{
            background: "#f5f7fa",
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #d8dde0",
            lineHeight: "1.6",
            color: "#333",
            marginBottom: "40px",
          }}
        >
          {
            responseLookup["ONTX_COMMENTS"] ??
            responseLookup["COMMENTS"] ??
            "No comments provided"
          }
        </div>
      </div>
    </div>
  );
}