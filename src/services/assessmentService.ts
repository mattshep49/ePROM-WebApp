import type { Questionnaire, TriggeredAlert } from "../types/questionnaire";

export async function getAssessment(token: string) {

    console.log("TOKEN=", token);

    const response = await fetch(
        `https://eprom-api-augvdqaeg4h5a9gj.uksouth-01.azurewebsites.net/api/GetAssessment?token=${token}`
    );

    if (!response.ok) {
        throw new Error("Assessment lookup failed");
    }

    return response.json();
}

export async function getQuestionnaires(questionnaireCodes: string[]) {
    const codesParam = questionnaireCodes.join(',');

    const response = await fetch(
        `https://eprom-api-augvdqaeg4h5a9gj.uksouth-01.azurewebsites.net/api/GetQuestionnaires?codes=${encodeURIComponent(codesParam)}`
    );

    if (!response.ok) {
        throw new Error("Failed to load questionnaires");
    }

    return response.json();
}

/**
 * Detects clinical alerts triggered by the current answers in a questionnaire.
 * Returns an array of triggered alerts for questions marked as clinicalAlertCapable.
 */
export function detectClinicalAlerts(
    questionnaire: Questionnaire,
    answers: Record<string, string | number>
): TriggeredAlert[] {
    const alerts: TriggeredAlert[] = [];

    questionnaire.questions.forEach((question) => {
        // Only check for alerts on questions capable of clinical alerts
        if (!question.clinicalAlertCapable) {
            return;
        }

        const currentAnswer = answers[question.questionCode];

        if (currentAnswer === undefined) {
            return;
        }

        // Find the selected option and check if it has an alert
        const selectedOption = question.options.find(
            (opt) => opt.value === currentAnswer
        );

        if (
            selectedOption &&
            selectedOption.alert &&
            selectedOption.alert.flag
        ) {
            alerts.push({
                questionCode: question.questionCode,
                message: selectedOption.alert.message,
                optionValue: selectedOption.value,
            });
        }
    });

    return alerts;
}
