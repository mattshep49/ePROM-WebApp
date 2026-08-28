import { useEffect, useState } from "react";
import { submitAssessment } from "../services/submissionService";
import trustLogo from "../assets/trustlogo.png";
import type {
  Questionnaire,
  Question,
} from "../types/questionnaire";

type Props = {
  questionnaire: Questionnaire;
};

type Answers = Record<string, string | number>;

export default function QuestionnaireRenderer({
  questionnaire,
}: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const urlParams = new URLSearchParams(
    window.location.search
  );

  const assessmentToken =
    urlParams.get("token") ?? "TEST123";

  useEffect(() => {
    const savedAnswers =
      localStorage.getItem(
        `eprom-${questionnaire.questionnaireCode}`
      );

    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch {
        console.error(
          "Unable to restore saved answers"
        );
      }
    }
    setIsLoaded(true);
  }, [questionnaire.questionnaireCode]);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      `eprom-${questionnaire.questionnaireCode}`,
      JSON.stringify(answers)
    );
  }, [
    answers,
    questionnaire.questionnaireCode,
    isLoaded,
  ]);


  const [validationErrors, setValidationErrors] =
    useState<string[]>([]);

  const updateAnswer = (
    questionCode: string,
    value: number
  ) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionCode]: value,
    }));
  };

  const evaluateRule = (
    answer: number,
    operator: string,
    triggerValue: number
  ): boolean => {
    switch (operator.trim().toLowerCase()) {
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
        console.warn(`Unsupported branch operator: ${operator}`);
        return false;
    }
  };

  const isQuestionVisible = (question: Question): boolean => {
    const controllingRules = questionnaire.questions.flatMap(
      (parentQuestion) =>
        (parentQuestion.branchRules ?? [])
          .filter(
            (rule) =>
              rule.targetQuestion === question.questionCode &&
              rule.action.trim().toLowerCase() === "show"
          )
          .map((rule) => ({
            parentQuestionCode: parentQuestion.questionCode,
            rule,
          }))
    );

    if (controllingRules.length === 0) {
      return true;
    }

    return controllingRules.some(
      ({ parentQuestionCode, rule }) => {
        const parentAnswer = answers[parentQuestionCode];

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

  const visibleQuestions = questionnaire.questions
    .filter(isQuestionVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const answeredVisibleQuestions = visibleQuestions.filter(
    (question) => answers[question.questionCode] !== undefined
  ).length;

  const progress =
    visibleQuestions.length === 0
      ? 0
      : Math.round(
          (answeredVisibleQuestions / visibleQuestions.length) * 100
        );

  const validateAssessment = () => {
    const missing = visibleQuestions.filter(
      (q) => q.mandatory && answers[q.questionCode] === undefined
    );
    setValidationErrors(missing.map((q) => q.questionCode));
    return missing;
  };

  const handleSubmit = async () => {
    const missingQuestions = validateAssessment();

    if (missingQuestions.length > 0) {
      const firstQuestion = document.getElementById(
        missingQuestions[0].questionCode
      );

      firstQuestion?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      alert(
        `Please complete ${missingQuestions.length} required question(s).`
      );
      return;
    }

    setValidationErrors([]);

    const payload = {
      assessmentToken: assessmentToken,
      assessmentCode: questionnaire.questionnaireCode,
      submittedDate: new Date().toISOString(),
      responses: Object.entries(answers).map(
        ([questionCode, responseValue]) => ({
          questionCode,
          responseValue,
        })
      ),
    };

    try {

  const result = await submitAssessment(payload);

  console.log(result);

  alert("Assessment submitted successfully.");

}catch (error) {
  console.error("SUBMIT ERROR:", error);
  alert("Submission failed. Please try again.");
}
  };

  const errorBannerStyle = {
    background: "#fef0f0",
    border: "2px solid #d5281b",
    color: "#d5281b",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "24px",
    fontWeight: 600 as const,
  };

  let previousSection = "";

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto 48px auto",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#212b32",
      }}
    >
            <header
        style={{
          padding: "28px",
          marginBottom: "28px",
          color: "#ffffff",
          background:
            "linear-gradient(135deg, #005eb8 0%, #003d78 100%)",
          borderRadius: "14px",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.14)",
        }}
      >
        <img
          src={trustLogo}
          alt="Trust Logo"
          style={{
            height: "60px",
            marginBottom: "16px",
          }}
        />

        <h1 style={{ margin: 0, fontSize: "28px" }}>
          {questionnaire.questionnaireCode}
        </h1>

        <div
          style={{
            marginTop: "20px",
            height: "12px",
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.25)",
            borderRadius: "999px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#ffffff",
              borderRadius: "999px",
              transition: "width 250ms ease",
            }}
          />
        </div>

        <p style={{ margin: "10px 0 0 0", fontSize: "14px" }}>
          {answeredVisibleQuestions} of {visibleQuestions.length}{" "}
          questions answered, {progress}% complete
        </p>
      </header>
            
      {validationErrors.length > 0 && (
        <div style={errorBannerStyle}>
          Please complete all required questions before submitting.
        </div>
      )}

      {visibleQuestions.map((question) => {
        const showSection = question.section !== previousSection;
        previousSection = question.section;

        const currentAnswer = answers[question.questionCode];
        const isSlider =
          question.responseType.toLowerCase() === "integer" ||
          question.scaleCode.toUpperCase() === "VAS_0_100";
        const isText =
          question.responseType.toLowerCase() === "text" ||
          question.scaleCode.toUpperCase() === "FREE_TEXT";

        return (
          <section key={question.questionCode}>
            {showSection && (
              <div
                style={{
                  margin: "34px 0 18px 0",
                  paddingBottom: "10px",
                  borderBottom: "4px solid #005eb8",
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
              id={question.questionCode}
              style={{
                padding: "24px",
                marginBottom: "20px",
                background: "#ffffff",
                border: validationErrors.includes(
                  question.questionCode
                )
                  ? "3px solid #d5281b"
                  : "1px solid #d8dde0",
                borderRadius: "14px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px 0",
                  color: "#4c6272",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                {question.questionNumber}
              </p>

              <h3
                style={{
                  margin: "0 0 22px 0",
                  color: "#212b32",
                  fontSize: "20px",
                  lineHeight: 1.45,
                }}
              >
                {question.questionText}
              </h3>

              {isSlider ? (
                <div>
                  <output
                    style={{
                      display: "block",
                      marginBottom: "16px",
                      color: "#005eb8",
                      fontSize: "42px",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    {currentAnswer === undefined
                      ? "Select a value"
                      : currentAnswer}
                  </output>

                  <input
                    aria-label={question.questionText}
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={
                      typeof currentAnswer === "number"
                        ? currentAnswer
                        : 50
                    }
                    onChange={(event) =>
                      updateAnswer(
                        question.questionCode,
                        Number(event.target.value)
                      )
                    }
                    style={{
                      width: "100%",
                      accentColor: "#005eb8",
                      cursor: "pointer",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "20px",
                      marginTop: "12px",
                      color: "#4c6272",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    <span>0: Worst health imaginable</span>
                    <span style={{ textAlign: "right" }}>
                      100: Best health imaginable
                    </span>
                  </div>
                </div>
              ) : isText ? (
                <div>
                  <textarea
                    value={
                      typeof currentAnswer === "string"
                        ? currentAnswer
                        : ""
                    }
                    onChange={(event) =>
                      setAnswers((currentAnswers) => ({
                        ...currentAnswers,
                        [question.questionCode]:
                          event.target.value,
                      }))
                    }
                    rows={6}
                    placeholder="Enter your comments here..."
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid #b1b4b6",
                      fontSize: "16px",
                      fontFamily: "inherit",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ) : (
                <div>
                  {question.options.map((option) => {
                    const selected =
                      currentAnswer === option.value;

                    return (
                      <label
                        key={`${question.questionCode}-${option.value}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "14px 16px",
                          marginBottom: "10px",
                          background: selected
                            ? "#e8f1f8"
                            : "#ffffff",
                          border: selected
                            ? "2px solid #005eb8"
                            : "1px solid #b1b4b6",
                          borderRadius: "10px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name={question.questionCode}
                          value={option.value}
                          checked={selected}
                          onChange={() =>
                            updateAnswer(
                              question.questionCode,
                              option.value
                            )
                          }
                          style={{
                            width: "20px",
                            height: "20px",
                            accentColor: "#005eb8",
                          }}
                        />
                        <span>{option.text}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {question.mandatory && (
                <p
                  style={{
                    margin: "16px 0 0 0",
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
      })}

      {validationErrors.length > 0 && (
        <div style={errorBannerStyle}>
          Please complete all required questions before submitting.
        </div>
      )}

      <div
        style={{
          marginTop: "40px",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        <button
          onClick={handleSubmit}
          style={{
            background: "#005eb8",
            color: "white",
            border: "none",
            padding: "16px 32px",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          Submit Assessment
        </button>
      </div>
    </main>
  );
}