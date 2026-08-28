import { useEffect, useState } from "react";

import QuestionnaireRenderer from "./components/QuestionnaireRenderer";
import { getAssessment } from "./services/assessmentService";

import onTxOhs from "./data/OnTxOHS.json";
import onTxSymptom from "./data/ONTX_SYMPTOM.json";
import offTxOhs from "./data/OffTxOHS.json";
import offTxFactB from "./data/OFFTX_FACTB.json";

import hdftLogo from "./assets/trustlogo.png";

interface Assessment {
  token: string;
  assessmentId: "ONTX" | "OFFTX";
  questionnaires: string[];
}

function App() {
  const [assessment, setAssessment] =
    useState<Assessment | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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

        if (result.error || !result.assessmentId) {
          setAssessment(null);
          setLoadError(
            result.error ?? "The assessment could not be found."
          );
          return;
        }

        setAssessment(result as Assessment);
        console.log(result);
      } catch (error) {
        console.error("Assessment lookup failed:", error);

        setAssessment(null);
        setLoadError(
          "The assessment could not be loaded. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadAssessment();
  }, [token]);

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        Loading assessment...
      </div>
    );
  }

  if (!assessment || loadError) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h1>Invalid Assessment Link</h1>

        <p>
          {loadError ?? "The assessment could not be found."}
        </p>
      </div>
    );
  }

  const questionnaireMap = {
  ONTX_OHS: onTxOhs,
  ONTX_SYMPTOM: onTxSymptom,
  OFFTX_OHS: offTxOhs,
  OFFTX_FACTB: offTxFactB,
};

const questionnaires =
  assessment.questionnaires.map(
    (questionnaireCode: string) =>
      questionnaireMap[
        questionnaireCode as keyof typeof questionnaireMap
      ]
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          textAlign: "center",
          borderBottom: "1px solid #d8dde0",
        }}
      >
        <img

src={hdftLogo}

alt="HDFT"

style={{
  maxWidth: "100%",
  height: "auto",
}} />

        <p style={{ margin: "12px 0 0 0" }}>
          Assessment Reference: {token}
        </p>
      </div>

      <div style={{ padding: "40px" }}>
        {questionnaires.map((questionnaire) => (
          <QuestionnaireRenderer
            key={questionnaire.questionnaireCode}
            questionnaire={questionnaire}
          />
        ))}
      </div>
    </div>
  );
}

export default App;