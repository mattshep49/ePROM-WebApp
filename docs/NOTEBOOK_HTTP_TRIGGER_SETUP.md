# HTTP Trigger Setup for Notebook Processing

## Overview
When an assessment is submitted, trigger a Fabric notebook to process and store the data in the Lakehouse.

## Option 1: Azure Function (Recommended)

### Function Code (Python)
Create a new Azure Function `ProcessAssessmentSubmission` with HTTP trigger:

```python
import azure.functions as func
import json
import requests
from datetime import datetime

def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    HTTP trigger to process submitted assessment data.
    Calls Fabric notebook via REST API.
    """
    try:
        # Parse submission payload
        body = req.get_json()
        assessment_token = body.get('assessmentToken')
        assessment_code = body.get('assessmentCode')
        responses = body.get('responses')
        submitted_date = body.get('submittedDate')
        
        # Call Fabric notebook to process data
        notebook_result = trigger_fabric_notebook(
            assessment_token=assessment_token,
            assessment_code=assessment_code,
            responses=responses,
            submitted_date=submitted_date
        )
        
        return func.HttpResponse(
            json.dumps({
                'success': True,
                'message': 'Assessment processed successfully',
                'notebookJobId': notebook_result.get('jobId')
            }),
            status_code=200,
            mimetype='application/json'
        )
        
    except Exception as e:
        return func.HttpResponse(
            json.dumps({
                'success': False,
                'error': str(e)
            }),
            status_code=500,
            mimetype='application/json'
        )

def trigger_fabric_notebook(assessment_token, assessment_code, responses, submitted_date):
    """
    Trigger Fabric notebook to process assessment data.
    Uses Fabric REST API.
    """
    # Fabric workspace and notebook details
    workspace_id = "<YOUR_WORKSPACE_ID>"
    notebook_id = "<YOUR_NOTEBOOK_ID>"
    
    # Authentication token (from environment or managed identity)
    token = get_fabric_token()
    
    # Prepare parameters for notebook
    notebook_params = {
        'assessmentToken': assessment_token,
        'assessmentCode': assessment_code,
        'responses': json.dumps(responses),
        'submittedDate': submitted_date
    }
    
    # Call Fabric notebook via REST API
    url = f"https://api.fabric.microsoft.com/v1/workspaces/{workspace_id}/notebooks/{notebook_id}/jobs"
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    response = requests.post(url, json=notebook_params, headers=headers)
    response.raise_for_status()
    
    return response.json()

def get_fabric_token():
    """
    Get access token for Fabric API.
    Use managed identity or service principal credentials.
    """
    # Implementation depends on your auth method
    pass
```

## Option 2: Update Existing Backend

If you prefer to keep everything in your current `submitAssessmentEprom` function:

```csharp
// In your existing SubmitAssessmentEprom Azure Function

[FunctionName("SubmitAssessmentEprom")]
public async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req)
{
    // 1. Save assessment to database
    var submissionId = await SaveAssessment(assessmentData);
    
    // 2. Trigger notebook processing (fire-and-forget)
    await TriggerNotebookProcessing(new {
        assessmentToken = assessmentData.Token,
        assessmentCode = assessmentData.Code,
        responses = assessmentData.Responses,
        submittedDate = DateTime.UtcNow
    });
    
    // 3. Return success to client immediately
    return new OkObjectResult(new { 
        success = true, 
        assessmentToken = submissionId 
    });
}

private async Task TriggerNotebookProcessing(object assessmentData)
{
    using (var client = new HttpClient())
    {
        var json = JsonConvert.SerializeObject(assessmentData);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        // Call your Fabric notebook endpoint
        await client.PostAsync(
            "https://fabric-notebook-endpoint.azurewebsites.net/api/ProcessSubmission",
            content
        );
    }
}
```

## Option 3: Direct Fabric Notebook HTTP API

If your Fabric notebook has an HTTP endpoint:

1. In the notebook, enable REST API execution
2. Call directly from your frontend or backend
3. Pass assessment data as parameters

## Implementation Steps

1. **Create/Update Azure Function**
   - Add HTTP trigger for processing submissions
   - Authenticate to Fabric API (use Managed Identity)
   - Call notebook asynchronously

2. **Create Fabric Notebook** (`NB_MATT_EPROM_ProcessSubmission.ipynb`)
   - Accept parameters: assessmentToken, assessmentCode, responses, submittedDate
   - Validate and transform response data
   - Write to `eprom_submissions` table in Lakehouse
   - Track processing status

3. **Update Submission Service** (Frontend)
   - After successful submission, optionally call trigger endpoint
   - Or let backend trigger automatically

4. **Authentication**
   - Use Azure Managed Identity for Function → Fabric
   - No credential storage needed

## Notebook Template

See `NB_MATT_EPROM_ProcessSubmission.ipynb` for the processing logic.

## Troubleshooting

- **Notebook not found**: Verify workspace ID and notebook ID
- **Auth failures**: Check Fabric permissions for service principal/managed identity
- **Timeout**: Use async job submission, not waiting for completion
- **Data validation**: Add logging in notebook for debugging

## Security Considerations

- Use Managed Identity (no API keys)
- Validate all input parameters in notebook
- Store sensitive config in Key Vault
- Log all submissions for audit trail
