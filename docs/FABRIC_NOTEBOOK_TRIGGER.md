# Fabric Notebook HTTP Trigger Setup

## What You Need to Do

Your submission service is now configured to trigger `NB_MATT_EPROM_process_submissions` after each assessment submission.

### Step 1: Check Your Notebook Parameters

Open your notebook in Fabric and look for the first cell(s) that look like:

```python
# Example - your notebook may have different parameter names:
assessmentToken = dbutils.widgets.get("assessmentToken", "")
assessmentCode = dbutils.widgets.get("assessmentCode", "")
responses = dbutils.widgets.get("responses", "")
submittedDate = dbutils.widgets.get("submittedDate", "")
```

**If the parameter names are different**, update line in `src/services/submissionService.ts` around line 42-47:

```typescript
const notebookParams = {
    assessmentToken: submissionPayload.assessmentToken,      // ← adjust these keys
    assessmentCode: submissionPayload.assessmentCode,        // ← to match your notebook
    responses: JSON.stringify(submissionPayload.responses),  // ← parameter names
    submittedDate: submissionPayload.submittedDate,
};
```

### Step 2: Set Up Fabric API Authentication

The code needs a Fabric API token. You have several options:

**Option A: Service Principal (Recommended for Production)**

```bash
# 1. Create a Service Principal in Azure AD
# 2. Grant it Contributor role on your workspace
# 3. Store credentials securely

# .env file:
VITE_FABRIC_CLIENT_ID=your-client-id
VITE_FABRIC_CLIENT_SECRET=your-client-secret
VITE_FABRIC_TENANT_ID=your-tenant-id
```

Then update `getFabricToken()` in `submissionService.ts`:

```typescript
async function getFabricToken(): Promise<string> {
  const clientId = import.meta.env.VITE_FABRIC_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_FABRIC_CLIENT_SECRET;
  const tenantId = import.meta.env.VITE_FABRIC_TENANT_ID;

  const response = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://analysis.windows.net/powerbi/api/.default",
        grant_type: "client_credentials",
      }).toString(),
    }
  );

  const data = await response.json();
  return data.access_token;
}
```

**Option B: Use Backend API Instead**

Instead of calling Fabric API from frontend, make a call to your backend:

```typescript
// In submissionService.ts
const url = import.meta.env.VITE_BACKEND_URL + "/api/trigger-notebook";

const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(notebookParams),
});
```

Your backend handles Fabric authentication using managed identity.

**Option C: Azure Function with Managed Identity**

Create an Azure Function that:
1. Receives the submission payload
2. Uses Managed Identity to get Fabric token
3. Calls Fabric notebook API
4. Returns result

This is the most secure approach.

### Step 3: Test the Integration

1. Submit an assessment via the web app
2. Check browser console for logs
3. If successful, you'll see: `✓ Fabric notebook triggered: {...}`
4. Check your Fabric workspace for notebook execution logs

### Step 4: Monitor Notebook Execution

In Fabric workspace:
1. Open the notebook `NB_MATT_EPROM_process_submissions`
2. Go to **History** tab
3. Click recent executions to see logs

---

## Environment Variables Needed

Add to your `.env` file based on your chosen authentication method:

```bash
# Workspace ID (already set)
VITE_WORKSPACE_ID=d4c99880-75ca-4b1c-bfce-3fb2e6586667

# Option A - Service Principal (for frontend auth)
VITE_FABRIC_CLIENT_ID=your-sp-client-id
VITE_FABRIC_CLIENT_SECRET=your-sp-client-secret
VITE_FABRIC_TENANT_ID=your-tenant-id

# Option B - Backend URL (for backend-handled auth)
VITE_BACKEND_URL=https://your-api.azurewebsites.net

# Option C - Pre-generated token (development only)
VITE_FABRIC_TOKEN=your-access-token
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Notebook trigger failed: Unauthorized" | Token expired or invalid. Check auth setup. |
| "Notebook not found" | Verify notebook name and workspace ID are correct. |
| "Invalid parameters" | Check parameter names match your notebook's `dbutils.widgets.get()` calls. |
| "No token found" | Configure `VITE_FABRIC_TOKEN` or other auth credentials. |
| Notebook executes but doesn't process data | Check notebook logs for validation errors. |

## What Happens Next

When trigger succeeds:

1. ✅ User sees "Assessment submitted" page
2. ✅ Browser calls Fabric API to execute notebook (background)
3. ✅ Notebook receives assessment data as parameters
4. ✅ Notebook processes and stores data in Lakehouse
5. ✅ Results available for analytics/reporting

---

## Next Actions

1. [ ] Open your notebook and note the parameter names (if different from defaults)
2. [ ] Choose authentication method (A, B, or C above)
3. [ ] Set up environment variables
4. [ ] Test by submitting an assessment
5. [ ] Monitor notebook execution logs

Need help with any step? Let me know!
