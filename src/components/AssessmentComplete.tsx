import trustLogo from "../assets/trustlogo.png";
import SymptomSeverity from "./SymptomSeverity";

type ResponseItem = {
  questionCode: string;
  responseValue: string | number;
};

type Props = {
  assessmentToken: string;
  assessmentCode: string;
  submittedDate: string;
  responses: ResponseItem[];
};

export default function AssessmentComplete({
  assessmentToken,
  assessmentCode,
  submittedDate,
  responses,
}: Props) {

  const responseLookup = Object.fromEntries(
    responses.map((r) => [
      r.questionCode,
      r.responseValue,
    ])
  );

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
          {trustLogo}

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

        <h3>Submission Details</h3>

        <p>
          <strong>Assessment Reference:</strong>{" "}
          {assessmentToken}
        </p>

        <p>
          <strong>Assessment Type:</strong>{" "}
          {assessmentCode}
        </p>

        <p>
          <strong>Submitted:</strong>{" "}
          {submittedDate}
        </p>

        {responseLookup["ONTX_OHS_Q1"] && (
          <>
            <h2>Overall Health Today</h2>

            <div
              style={{
                textAlign: "center",
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  fontSize: "72px",
                  fontWeight: 700,
                  color: "#005eb8",
                }}
              >
                {responseLookup["ONTX_OHS_Q1"]}
              </div>

              <div
                style={{
                  fontSize: "18px",
                }}
              >
                out of 100
              </div>
            </div>
          </>
        )}

        {Object.keys(responseLookup).some(
          (x) => x.startsWith("ONTX_SYMPTOM")
        ) && (
          <>
            <h2>Symptom Summary</h2>

            <SymptomSeverity
              label="Cough"
              value={Number(responseLookup["ONTX_SYMPTOM_Q1"] ?? 0)}
            />

            <SymptomSeverity
              label="Dizziness"
              value={Number(responseLookup["ONTX_SYMPTOM_Q2"] ?? 0)}
            />

            <SymptomSeverity
              label="Fatigue"
              value={Number(responseLookup["ONTX_SYMPTOM_Q3"] ?? 0)}
            />

            <SymptomSeverity
              label="Nausea"
              value={Number(responseLookup["ONTX_SYMPTOM_Q4"] ?? 0)}
            />

            <SymptomSeverity
              label="Pain"
              value={Number(responseLookup["ONTX_SYMPTOM_Q5"] ?? 0)}
            />

            <SymptomSeverity
              label="Diarrhoea"
              value={Number(responseLookup["ONTX_SYMPTOM_Q6"] ?? 0)}
            />

            <SymptomSeverity
              label="Constipation"
              value={Number(responseLookup["ONTX_SYMPTOM_Q7"] ?? 0)}
            />

            <SymptomSeverity
              label="Itchiness"
              value={Number(responseLookup["ONTX_SYMPTOM_Q8"] ?? 0)}
            />

            <SymptomSeverity
              label="Dry Skin"
              value={Number(responseLookup["ONTX_SYMPTOM_Q9"] ?? 0)}
            />
          </>
        )}

        <h2>Additional Comments</h2>

        <div
          style={{
            background: "#f5f7fa",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #d8dde0",
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