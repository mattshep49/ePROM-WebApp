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

        {responseLookup["ONTX_OHS_Q1"] && (
          <>
            <h2 style={{ marginTop: "50px", marginBottom: "30px" }}>
              Overall Health Today
            </h2>

            <div
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
                    {responseLookup["ONTX_OHS_Q1"]} / 100
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
                      width: `${responseLookup["ONTX_OHS_Q1"]}%`,
                      height: "100%",
                      borderRadius: "12px",
                      background:
                        Number(responseLookup["ONTX_OHS_Q1"]) >= 70
                          ? "#28a745"
                          : Number(responseLookup["ONTX_OHS_Q1"]) >= 40
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
          </>
        )}

        {Object.keys(responseLookup).some(
          (x) => x.startsWith("ONTX_Q")
        ) && (
          <>
            <h2 style={{ marginTop: "50px", marginBottom: "30px" }}>
              On-Treatment Symptom Assessment
            </h2>

            <div style={{ marginBottom: "50px" }}>
              {responseLookup["ONTX_Q1"] !== undefined && (
                <div style={{ marginBottom: "25px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <strong style={{ fontSize: "15px" }}>
                      Fatigue, Tiredness or Lack of Energy
                    </strong>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#005eb8",
                      }}
                    >
                      {responseLookup["ONTX_Q1"]} / 4
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
                        width: `${(Number(responseLookup["ONTX_Q1"]) / 4) * 100}%`,
                        height: "100%",
                        borderRadius: "12px",
                        background: "#005eb8",
                      }}
                    />
                  </div>
                </div>
              )}

              {responseLookup["ONTX_Q2"] !== undefined && (
                <div style={{ marginBottom: "25px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <strong style={{ fontSize: "15px" }}>
                      Dizziness
                    </strong>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#005eb8",
                      }}
                    >
                      {responseLookup["ONTX_Q2"]} / 4
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
                        width: `${(Number(responseLookup["ONTX_Q2"]) / 4) * 100}%`,
                        height: "100%",
                        borderRadius: "12px",
                        background: "#005eb8",
                      }}
                    />
                  </div>
                </div>
              )}

              {responseLookup["ONTX_Q3"] !== undefined && (
                <div style={{ marginBottom: "25px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <strong style={{ fontSize: "15px" }}>
                      Pain or Aching
                    </strong>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#005eb8",
                      }}
                    >
                      {responseLookup["ONTX_Q3"]} / 4
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
                        width: `${(Number(responseLookup["ONTX_Q3"]) / 4) * 100}%`,
                        height: "100%",
                        borderRadius: "12px",
                        background: "#005eb8",
                      }}
                    />
                  </div>
                </div>
              )}

              {responseLookup["ONTX_Q4"] !== undefined && (
                <div style={{ marginBottom: "25px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <strong style={{ fontSize: "15px" }}>
                      Nausea
                    </strong>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#005eb8",
                      }}
                    >
                      {responseLookup["ONTX_Q4"]} / 4
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
                        width: `${(Number(responseLookup["ONTX_Q4"]) / 4) * 100}%`,
                        height: "100%",
                        borderRadius: "12px",
                        background: "#005eb8",
                      }}
                    />
                  </div>
                </div>
              )}

              {responseLookup["ONTX_Q5"] !== undefined && (
                <div style={{ marginBottom: "25px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <strong style={{ fontSize: "15px" }}>
                      Vomiting
                    </strong>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#005eb8",
                      }}
                    >
                      {responseLookup["ONTX_Q5"]} / 4
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
                        width: `${(Number(responseLookup["ONTX_Q5"]) / 4) * 100}%`,
                        height: "100%",
                        borderRadius: "12px",
                        background: "#005eb8",
                      }}
                    />
                  </div>
                </div>
              )}

              {responseLookup["ONTX_Q6"] !== undefined && (
                <div style={{ marginBottom: "25px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <strong style={{ fontSize: "15px" }}>
                      Diarrhoea
                    </strong>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#005eb8",
                      }}
                    >
                      {responseLookup["ONTX_Q6"]} / 4
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
                        width: `${(Number(responseLookup["ONTX_Q6"]) / 4) * 100}%`,
                        height: "100%",
                        borderRadius: "12px",
                        background: "#005eb8",
                      }}
                    />
                  </div>
                </div>
              )}

              {responseLookup["ONTX_Q7"] !== undefined && (
                <div style={{ marginBottom: "25px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <strong style={{ fontSize: "15px" }}>
                      Constipation
                    </strong>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#005eb8",
                      }}
                    >
                      {responseLookup["ONTX_Q7"]} / 4
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
                        width: `${(Number(responseLookup["ONTX_Q7"]) / 4) * 100}%`,
                        height: "100%",
                        borderRadius: "12px",
                        background: "#005eb8",
                      }}
                    />
                  </div>
                </div>
              )}

              {responseLookup["ONTX_Q8"] !== undefined && (
                <div style={{ marginBottom: "25px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <strong style={{ fontSize: "15px" }}>
                      Itchiness
                    </strong>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#005eb8",
                      }}
                    >
                      {responseLookup["ONTX_Q8"]} / 4
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
                        width: `${(Number(responseLookup["ONTX_Q8"]) / 4) * 100}%`,
                        height: "100%",
                        borderRadius: "12px",
                        background: "#005eb8",
                      }}
                    />
                  </div>
                </div>
              )}

              {responseLookup["ONTX_Q9"] !== undefined && (
                <div style={{ marginBottom: "25px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <strong style={{ fontSize: "15px" }}>
                      Dry Skin
                    </strong>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#005eb8",
                      }}
                    >
                      {responseLookup["ONTX_Q9"]} / 4
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
                        width: `${(Number(responseLookup["ONTX_Q9"]) / 4) * 100}%`,
                        height: "100%",
                        borderRadius: "12px",
                        background: "#005eb8",
                      }}
                    />
                  </div>
                </div>
              )}

              {responseLookup["ONTX_Q10"] !== undefined && (
                <div style={{ marginBottom: "25px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <strong style={{ fontSize: "15px" }}>
                      Hair Loss
                    </strong>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#005eb8",
                      }}
                    >
                      {responseLookup["ONTX_Q10"]} / 4
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
                        width: `${(Number(responseLookup["ONTX_Q10"]) / 4) * 100}%`,
                        height: "100%",
                        borderRadius: "12px",
                        background: "#005eb8",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

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