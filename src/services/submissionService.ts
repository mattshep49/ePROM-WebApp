export async function submitAssessment(
  payload: unknown
) {
  const response = await fetch(
    "https://submitassessmenteprom-d4ghcfctaugph7ge.uksouth-01.azurewebsites.net/api/SubmitAssessmentEprom",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Submission failed");
  }

  return await response.json();
}