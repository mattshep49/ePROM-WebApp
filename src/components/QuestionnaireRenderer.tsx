import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  Questionnaire,
  Question,
  TriggeredAlert,
} from "../types/questionnaire";
import { detectClinicalAlerts } from "../services/assessmentService";

type AnswerValue = string | number;
type Answers = Record<string, string | number>;

type QuestionnaireState = {
  answers: Answers;
  visibleRequiredQuestionCodes: string[];
  clinicalAlerts: TriggeredAlert[];
};

type Props = {
  questionnaire: Questionnaire;
  onAnswersChange: (
    questionnaireCode: string,
    state: QuestionnaireState
  ) => void;
};

export default function QuestionnaireRenderer({
  questionnaire,
  onAnswersChange,
}: Props) {
  const [answers, setAnswers] =
    useState<Answers>({});

  const [alerts, setAlerts] =
    useState<TriggeredAlert[]>([]);

  const [isLoaded, setIsLoaded] =
    useState(false);

  /*
   * Keep the latest callback without causing the answer effect
   * to rerun whenever App.tsx renders.
   */
  const onAnswersChangeRef =
    useRef(onAnswersChange);

  const evaluateRule = (
    answer: number,
    operator: string,
    triggerValue: number
  ): boolean => {
    switch (
      operator.trim().toLowerCase()
    ) {
      case "equals":
      case "equal":
      case "=":
        return answer === triggerValue;

      case "not equals":
      case "not equal":
      case "!=":
      case "<>":
        return answer !== triggerValue;

      case "greater than":
      case ">":
        return answer > triggerValue;

      case "greater than or equal":
      case ">=":
        return answer >= triggerValue;

      case "less than":
      case "<":
        return answer < triggerValue;

      case "less than or equal":
      case "<=":
        return answer <= triggerValue;

      default:
        console.warn(
          `Unsupported branch operator: ${operator}`
        );

        return false;
    }
  };

  const isQuestionVisible = (
    question: Question
  ): boolean => {
    const controllingRules =
      questionnaire.questions.flatMap(
        (parentQuestion) =>
          (
            parentQuestion.branchRules ?? []
          )
            .filter(
              (rule) =>
                rule.targetQuestion ===
                  question.questionCode &&
                rule.action
                  .trim()
                  .toLowerCase() === "show"
            )
            .map((rule) => ({
              parentQuestionCode:
                parentQuestion.questionCode,
              rule,
            }))
      );

    if (controllingRules.length === 0) {
      return true;
    }

    return controllingRules.some(
      ({
        parentQuestionCode,
        rule,
      }) => {
        const parentAnswer =
          answers[parentQuestionCode];

        if (parentAnswer === undefined) {
          return false;
        }

        return evaluateRule(
          Number(parentAnswer),
          rule.operator,
          rule.triggerValue
        );
      }
    );
  };

  const visibleQuestions =
    questionnaire.questions
      .filter(isQuestionVisible)
      .sort(
        (first, second) =>
          first.displayOrder -
          second.displayOrder
      );

  useEffect(() => {
    onAnswersChangeRef.current =
      onAnswersChange;
  }, [onAnswersChange]);

  /*
   * Restore any locally saved answers for this questionnaire.
   */
  useEffect(() => {
    const storageKey =
      `eprom-${questionnaire.questionnaireCode}`;

    const savedAnswers =
      localStorage.getItem(storageKey);

    let restoredAnswers: Answers = {};

    if (savedAnswers) {
      try {
        restoredAnswers =
          JSON.parse(savedAnswers) as Answers;
      } catch (error) {
        console.error(
          "Unable to restore saved answers:",
          error
        );
      }
    }

    setAnswers(restoredAnswers);
    setIsLoaded(true);

    
  }, [questionnaire.questionnaireCode]);

  /*
   * Detect clinical alerts based on current answers.
   */
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const detectedAlerts =
      detectClinicalAlerts(questionnaire, answers);
    setAlerts(detectedAlerts);
  }, [answers, isLoaded, questionnaire]);

  /*
   * Save answers locally and report them to App.tsx.
   */
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const storageKey =
      `eprom-${questionnaire.questionnaireCode}`;

    localStorage.setItem(
      storageKey,
      JSON.stringify(answers)
    );

    const visibleRequiredQuestionCodes =
      visibleQuestions
        .filter((question) => question.mandatory)
        .map((question) => question.questionCode);

    onAnswersChangeRef.current(
      questionnaire.questionnaireCode,
      {
        answers,
        visibleRequiredQuestionCodes,
        clinicalAlerts: alerts,
      }
    );
  }, [
    answers,
    alerts,
    isLoaded,
    questionnaire.questionnaireCode,
    visibleQuestions,
  ]);

  const updateAnswer = (
    questionCode: string,
    value: AnswerValue
  ) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionCode]: value,
    }));
  };

  const answeredVisibleQuestions =
    visibleQuestions.filter(
      (question) =>
        answers[question.questionCode] !==
        undefined
    ).length;

  const progress =
    visibleQuestions.length === 0
      ? 0
      : Math.round(
          (
            answeredVisibleQuestions /
            visibleQuestions.length
          ) * 100
        );

  let previousSection = "";

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto 48px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#212b32",
        display: "flex",
        flexDirection: "column",
        maxHeight: "90vh",
        overflow: "hidden",
      }}
    >
      <header
        style={{
          padding: "28px",
          color: "#ffffff",
          background:
            "linear-gradient(135deg, #005eb8 0%, #003d78 100%)",
          borderRadius: "14px",
          boxShadow:
            "0 4px 14px rgba(0, 0, 0, 0.14)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
          }}
        >
          {questionnaire.questionnaireCode}
        </h1>

        <div
          style={{
            marginTop: "20px",
            height: "12px",
            overflow: "hidden",
            background:
              "rgba(255, 255, 255, 0.25)",
            borderRadius: "999px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#ffffff",
              borderRadius: "999px",
              transition:
                "width 250ms ease",
            }}
          />
        </div>

        <p
          style={{
            margin: "10px 0 0",
            fontSize: "14px",
          }}
        >
          {answeredVisibleQuestions} of{" "}
          {visibleQuestions.length} questions
          answered, {progress}% complete
        </p>
      </header>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingTop: "28px",
        }}
      >
        {alerts.length > 0 && (
          <section
            style={{
              marginBottom: "28px",
              padding: "16px 20px",
              background: "#fee2e2",
              border: "2px solid #dc2626",
              borderRadius: "10px",
              position: "sticky",
              top: 0,
              zIndex: 99,
            }}
          >
          <h2
            style={{
              margin: "0 0 12px",
              color: "#991b1b",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            Clinical Alerts ({alerts.length})
          </h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: "20px",
              color: "#7f1d1d",
            }}
          >
            {alerts.map((alert, index) => {
              const alertQuestion = questionnaire.questions.find(
                (q) => q.questionCode === alert.questionCode
              );
              return (
              <li
                key={index}
                style={{
                  marginBottom: "12px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                <strong style={{ color: "#991b1b" }}>
                  {alertQuestion?.questionNumber}: {alertQuestion?.questionText}
                </strong>
                <br />
                <span style={{ color: "#7f1d1d" }}>{alert.message}</span>
              </li>
              );
            })}
          </ul>
          </section>
        )}

        {visibleQuestions.map(
        (question) => {
          const showSection =
            question.section !==
            previousSection;

          previousSection =
            question.section;

          const currentAnswer =
            answers[
              question.questionCode
            ];

          const responseType =
            question.responseType
              .trim()
              .toLowerCase();

          const scaleCode =
            question.scaleCode
              .trim()
              .toUpperCase();

          const isSlider =
            responseType === "integer" ||
            scaleCode === "VAS_0_100";

          const isText =
            responseType === "text" ||
            scaleCode === "FREE_TEXT";

          const questionAlert = alerts.find(
            (alert) =>
              alert.questionCode ===
              question.questionCode
          );

          return (
            <section
              key={
                question.questionCode
              }
            >
              {showSection && (
                <div
                  style={{
                    margin:
                      "34px 0 18px",
                    paddingBottom: "10px",
                    borderBottom:
                      "4px solid #005eb8",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      color: "#005eb8",
                      fontSize: "24px",
                    }}
                  >
                    {question.section}
                  </h2>
                </div>
              )}

              <article
                id={
                  question.questionCode
                }
                style={{
                  padding: "24px",
                  marginBottom: "20px",
                  background: questionAlert
                    ? "#fef2f2"
                    : "#ffffff",
                  border: questionAlert
                    ? "2px solid #dc2626"
                    : "1px solid #d8dde0",
                  borderRadius: "14px",
                  boxShadow:
                    "0 2px 8px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#4c6272",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {
                      question.questionNumber
                    }
                  </p>

                  {questionAlert && (
                    <span
                      style={{
                        padding:
                          "4px 8px",
                        background:
                          "#dc2626",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: 700,
                        borderRadius:
                          "4px",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      ⚠ ALERT
                    </span>
                  )}
                </div>

                <h3
                  style={{
                    margin:
                      "0 0 22px",
                    color: "#212b32",
                    fontSize: "20px",
                    lineHeight: 1.45,
                  }}
                >
                  {
                    question.questionText
                  }
                </h3>

                {questionAlert && (
                  <div
                    style={{
                      marginBottom: "22px",
                      padding: "12px 14px",
                      background:
                        "#fee2e2",
                      border:
                        "1px solid #fca5a5",
                      borderRadius: "8px",
                      color: "#991b1b",
                      fontSize: "14px",
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>
                      ⚠ Clinical Alert:
                    </strong>{" "}
                    {questionAlert.message}
                  </div>
                )}

                {isSlider ? (
                  <div>
                    <output
                      style={{
                        display: "block",
                        marginBottom:
                          "16px",
                        color: "#005eb8",
                        fontSize: "42px",
                        fontWeight: 700,
                        textAlign:
                          "center",
                      }}
                    >
                      {currentAnswer ===
                      undefined
                        ? "Select a value"
                        : currentAnswer}
                    </output>

                    <input
                      aria-label={
                        question.questionText
                      }
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={
                        typeof currentAnswer ===
                        "number"
                          ? currentAnswer
                          : 50
                      }
                      onChange={(event) =>
                        updateAnswer(
                          question.questionCode,
                          Number(
                            event.target
                              .value
                          )
                        )
                      }
                      style={{
                        width: "100%",
                        accentColor:
                          "#005eb8",
                        cursor: "pointer",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        gap: "20px",
                        marginTop: "12px",
                        color: "#4c6272",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      <span>
                        0: Worst health
                        imaginable
                      </span>

                      <span
                        style={{
                          textAlign:
                            "right",
                        }}
                      >
                        100: Best health
                        imaginable
                      </span>
                    </div>
                  </div>
                ) : isText ? (
                  <textarea
                    value={
                      typeof currentAnswer ===
                      "string"
                        ? currentAnswer
                        : ""
                    }
                    onChange={(event) =>
                      updateAnswer(
                        question.questionCode,
                        event.target.value
                      )
                    }
                    rows={6}
                    placeholder="Enter your comments here..."
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border:
                        "1px solid #b1b4b6",
                      fontSize: "16px",
                      fontFamily: "inherit",
                      resize: "vertical",
                      boxSizing:
                        "border-box",
                    }}
                  />
                ) : (
                  <div>
                    {question.options.map(
                      (option) => {
                        const selected =
                          currentAnswer ===
                          option.value;

                        return (
                          <label
                            key={`${question.questionCode}-${option.value}`}
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "12px",
                              padding:
                                "14px 16px",
                              marginBottom:
                                "10px",
                              background:
                                selected
                                  ? "#e8f1f8"
                                  : "#ffffff",
                              border:
                                selected
                                  ? "2px solid #005eb8"
                                  : "1px solid #b1b4b6",
                              borderRadius:
                                "10px",
                              cursor:
                                "pointer",
                            }}
                          >
                            <input
                              type="radio"
                              name={
                                question.questionCode
                              }
                              value={
                                option.value
                              }
                              checked={
                                selected
                              }
                              onChange={() =>
                                updateAnswer(
                                  question.questionCode,
                                  option.value
                                )
                              }
                              style={{
                                width:
                                  "20px",
                                height:
                                  "20px",
                                accentColor:
                                  "#005eb8",
                              }}
                            />

                            <span>
                              {option.text}
                            </span>
                          </label>
                        );
                      }
                    )}
                  </div>
                )}

                {question.mandatory && (
                  <p
                    style={{
                      margin:
                        "16px 0 0",
                      color: "#4c6272",
                      fontSize: "13px",
                    }}
                  >
                    Required question
                  </p>
                )}
              </article>
            </section>
          );
        }
      )}
      </div>
    </main>
  );
}