import trustLogo from "../assets/trustlogo.png";

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
  responses
}: Props) {

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "40px"
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "40px",
          boxShadow:
            "0 2px 15px rgba(0,0,0,0.1)"
        }}
      >
        <div
          style={{
            textAlign: "center"
          }}
        >
          {trustLogo}

          <h1>
            Assessment Submitted
          </h1>

          <p>
            Thank you for completing your assessment.
          </p>
        </div>

        <hr />

        <h3>
          Submission Details
        </h3>

        <p>
          <strong>Assessment Reference:</strong>
          {" "}
          {assessmentToken}
        </p>

        <p>
          <strong>Assessment Type:</strong>
          {" "}
          {assessmentCode}
        </p>

        <p>
          <strong>Submitted:</strong>
          {" "}
          {submittedDate}
        </p>

        <h3>
          Response Summary
        </h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd"
                }}
              >
                Question
              </th>

              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd"
                }}
              >
                Response
              </th>
            </tr>
          </thead>

          <tbody>
            {responses.map((response) => (
              <tr key={response.questionCode}>
                <td
                  style={{
                    padding: "8px"
                  }}
                >
                  {response.questionCode}
                </td>

                <td
                  style={{
                    padding: "8px"
                  }}
                >
                  {response.responseValue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
