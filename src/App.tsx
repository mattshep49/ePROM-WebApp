import QuestionnaireRenderer from "./components/QuestionnaireRenderer";
import assessmentLookup from "./data/assessmentLookup.json";
import onTxOhs from "./data/OnTxOHS.json";
import onTxSymptom from "./data/ONTX_SYMPTOM.json";

import offTxOhs from "./data/OffTxOHS.json";
import offTxFactB from "./data/OFFTX_FACTB.json";

import hdftLogo from "./assets/trustlogo.png";

function App() {
  const urlParams = new URLSearchParams(
    window.location.search
  );

  const token =
    urlParams.get("token") ?? "abc123";

  /*
    Mock lookup.
    Later this will come from Azure Function.
  */

  const assessment =
  assessmentLookup.find(
    (a) =>
      a.assessmentToken === token
  );
if (!assessment) {
  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h1>
        Invalid Assessment Link
      </h1>

      <p>
        The assessment could not be found.
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
    (questionnaireCode) =>
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
          }}
        />
        <p style={{ margin: "12px 0 0 0" }}>
          Assessment Reference: {token}
        </p>
      </div>

      <div
        style={{
          padding: "40px",
        }}
      >
        {questionnaires.map(
          (questionnaire) => (
            <QuestionnaireRenderer
              key={
                questionnaire.questionnaireCode
              }
              questionnaire={
                questionnaire
              }
            />
          )
        )}
      </div>
    </div>
  );
}

export default App;