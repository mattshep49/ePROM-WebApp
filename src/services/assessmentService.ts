export async function getAssessment(token: string) {

    console.log("TOKEN=", token);

    const response = await fetch(
        `https://eprom-api-augvdqaeg4h5a9gj.uksouth-01.azurewebsites.net/api/GetAssessment?token=${token.toUpperCase()}`
    );

    if (!response.ok) {
        throw new Error("Assessment lookup failed");
    }

    return response.json();
}
