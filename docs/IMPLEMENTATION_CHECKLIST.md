# HTTP Notebook Trigger - Implementation Checklist

## ✅ Frontend Changes (Complete)
- [x] Updated `submissionService.ts` to call notebook trigger after submission
- [x] Trigger is asynchronous (fire-and-forget) - doesn't block user
- [x] Uses environment variable `VITE_NOTEBOOK_TRIGGER_URL` for flexibility

## 📋 Next Steps - Backend

### Step 1: Set up Azure Function
```bash
# Create new Azure Function with HTTP trigger
func new --name ProcessAssessmentSubmission --template "HTTP trigger" --language python
```

**Function code location:** Update `ProcessAssessmentSubmission/__init__.py` with Python code from setup guide

### Step 2: Configure Authentication
- Use **Managed Identity** (no credentials needed)
- Grant Function App → Fabric permissions:
  1. Go to Fabric workspace
  2. Workspace settings → Permissions
  3. Add your Function App's Managed Identity with "Admin" role

### Step 3: Create Fabric Notebook
1. In your Fabric workspace, create new notebook: `NB_MATT_EPROM_ProcessSubmission`
2. Copy content from template provided
3. Update table paths if different from examples

### Step 4: Environment Configuration
```bash
# Add to your Azure Function application settings
FABRIC_WORKSPACE_ID = "your-workspace-id"
FABRIC_NOTEBOOK_ID = "your-notebook-id"
FABRIC_TENANT_ID = "your-tenant-id"
```

### Step 5: Update Frontend Config
```bash
# Add to your .env file
VITE_NOTEBOOK_TRIGGER_URL=https://your-function-app.azurewebsites.net/api/ProcessAssessmentSubmission
```

### Step 6: Create Lakehouse Tables
Run these SQL commands in your Fabric workspace:

```sql
-- Table 1: Individual response records
CREATE TABLE eprom_submissions (
    AssessmentToken NVARCHAR(MAX),
    AssessmentCode NVARCHAR(MAX),
    QuestionCode NVARCHAR(MAX),
    ResponseValue NVARCHAR(MAX),
    ResponseType NVARCHAR(50),
    SubmittedDate DATETIME2,
    ProcessedDate DATETIME2,
    IsNumeric BIT
);

-- Table 2: Submission summaries
CREATE TABLE eprom_submission_summaries (
    AssessmentToken NVARCHAR(MAX) PRIMARY KEY,
    AssessmentCode NVARCHAR(MAX),
    TotalResponses INT,
    NumericResponses INT,
    TextResponses INT,
    SubmittedDate DATETIME2,
    ProcessedDate DATETIME2,
    ProcessingStatus NVARCHAR(50),
    ErrorMessage NVARCHAR(MAX)
);
```

## 🧪 Testing

### Test 1: Local Testing
```bash
# Start Function locally
func start

# In another terminal, submit test data
curl -X POST http://localhost:7071/api/ProcessAssessmentSubmission \
  -H "Content-Type: application/json" \
  -d '{
    "assessmentToken": "test-token-123",
    "assessmentCode": "OnTreatment",
    "responses": [{"questionCode": "Q1", "responseValue": 3}],
    "submittedDate": "2025-08-30T10:00:00Z"
  }'
```

### Test 2: Portal Testing
1. Submit an assessment via the web app
2. Check Azure Function logs for trigger call
3. Check Fabric notebook execution logs
4. Verify data in `eprom_submissions` table

### Test 3: End-to-End
- Submit assessment with various question types
- Confirm success message shows to user
- Wait 10-30 seconds
- Check Lakehouse for new records

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Notebook not found" | Verify workspace ID and notebook ID in function settings |
| "Authentication failed" | Check Managed Identity has Fabric permissions |
| "Function timeout" | Increase timeout in function.json to 300s |
| "Data not appearing" | Check notebook execution logs in Fabric |
| No trigger call | Verify VITE_NOTEBOOK_TRIGGER_URL is correct in .env |

## 📊 Monitoring

### Check Function Execution
1. Azure Portal → Function App → Functions → ProcessAssessmentSubmission
2. View "Monitor" tab for request logs

### Check Notebook Execution
1. Fabric workspace → Open notebook
2. View execution history
3. Check cell outputs for errors

### Query Results
```python
# In Fabric notebook
df = spark.table("eprom_submissions").toPandas()
print(f"Total records: {len(df)}")
print(df.groupby("AssessmentCode").size())
```

## 📝 Architecture Flow

```
User Submits Assessment
    ↓
Frontend calls submitAssessmentEprom (existing API)
    ↓
User sees success page
    ↓
submitAssessment() also calls ProcessAssessmentSubmission HTTP trigger
    ↓
Azure Function receives trigger request
    ↓
Function triggers Fabric notebook asynchronously
    ↓
Notebook validates data and writes to eprom_submissions table
    ↓
Data available for reporting/analytics
```

## 💡 Future Enhancements

- Add retry logic for failed submissions
- Send email notification when processing completes
- Create Power BI dashboard on submissions table
- Add webhook to notify external systems
- Archive old submissions periodically

---

**Files Modified:**
- `/src/services/submissionService.ts` - Added trigger call

**Files Created (for reference):**
- `/docs/NOTEBOOK_HTTP_TRIGGER_SETUP.md` - Detailed setup guide
- `/docs/NB_MATT_EPROM_ProcessSubmission_TEMPLATE.ipynb` - Notebook template
