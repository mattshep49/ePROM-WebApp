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
