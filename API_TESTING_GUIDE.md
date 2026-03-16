# API Testing Guide

## Prerequisites

1. **REST Client Extension**: Install the REST Client extension for VS Code
   - Extension ID: `humao.rest-client`
   - Or search "REST Client" in VS Code extensions

2. **Running Server**: Make sure your dev server is running
   ```bash
   pnpm dev
   ```

3. **Database**: Ensure database is initialized
   ```bash
   pnpm exec prisma db push
   ```

## Test User Credentials

The API tests are pre-configured with these credentials:

- **Name**: Jimmy Kimunyi
- **Email**: jkkimunyi@gmail.com
- **Password**: @_Kimunyi123!

## Quick Start Testing

### Step 1: Register User

Open `api-tests.http` in VS Code and click "Send Request" above test #1:

```http
### 1. Register Jimmy Kimunyi
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Jimmy Kimunyi",
  "email": "jkkimunyi@gmail.com",
  "password": "@_Kimunyi123!"
}
```

**Expected Responses**:
- **201 Created**: User created successfully
- **409 Conflict**: User already exists (this is OK!)

### Step 2: Login via Browser

1. Open http://localhost:3000/auth/login
2. Enter credentials:
   - Email: `jkkimunyi@gmail.com`
   - Password: `@_Kimunyi123!`
3. Click "Sign In"
4. You should be redirected to the dashboard

### Step 3: Get Session Token

1. Open Browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Cookies** → `http://localhost:3000`
4. Find cookie named `authjs.session-token`
5. Copy the entire value

### Step 4: Update REST Client Variables

In `api-tests.http`, update the session token variable:

```http
@sessionToken = YOUR_COPIED_TOKEN_HERE
```

### Step 5: Test Patient Creation

Click "Send Request" on test #6 to create a patient:

```http
### 6. Create a new patient
POST http://localhost:3000/api/patients
Cookie: authjs.session-token={{sessionToken}}
```

**Expected Response** (201):
```json
{
  "patient": {
    "id": "uuid-here",
    "name": "Jane Doe",
    "email": "encrypted-value",
    ...
  }
}
```

### Step 6: Copy Patient ID

From the response, copy the patient `id` value and update:

```http
@patientId = uuid-from-response
```

### Step 7: Test Other Endpoints

Now you can test all other endpoints! They all use the `{{sessionToken}}` and `{{patientId}}` variables.

## Testing Workflow

### Authentication Flow

1. ✅ **Register** (Test #1) → User created
2. ✅ **Login** (Browser) → Get session token  
3. ✅ **Duplicate Registration** (Test #2) → 409 error

### Patient Management Flow

1. ✅ **Create Patient** (Test #6) → Get patient ID
2. ✅ **Get All Patients** (Test #5) → See all your patients
3. ✅ **Get Specific Patient** (Test #7) → View patient details
4. ✅ **Update Patient** (Test #8) → Modify patient info
5. ✅ **Delete Patient** (Test #9) → Remove patient

### File Upload Flow

**Note**: File upload via REST Client is tricky. Use the web UI instead:

1. Go to http://localhost:3000/dashboard/files/upload
2. Select a patient
3. Upload a file
4. Copy the file ID from the files list
5. Update `@fileId` variable in api-tests.http
6. Test file endpoints (Tests #10-14)

## Common Issues & Solutions

### Issue: 401 Unauthorized

**Cause**: Session token is invalid or expired

**Solution**:
1. Login again via browser
2. Get a new session token
3. Update `@sessionToken` variable

### Issue: 404 Not Found (Patient/File)

**Cause**: Invalid ID in request

**Solution**:
1. Check that you've updated `@patientId` or `@fileId`
2. Verify the ID exists by using "Get All" endpoints first

### Issue: Connection Refused

**Cause**: Server not running or wrong port

**Solution**:
1. Check terminal output for actual port (might be 3001 if 3000 is busy)
2. Update `@baseUrl` in api-tests.http:
   ```http
   @baseUrl = http://localhost:3001/api
   ```

### Issue: CORS Errors

**Cause**: Not applicable for same-origin requests

**Solution**: Should not occur with REST Client extension

## Using Alternative Tools

### cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jimmy Kimunyi","email":"jkkimunyi@gmail.com","password":"@_Kimunyi123!"}'

# Get patients (replace TOKEN)
curl http://localhost:3000/api/patients \
  -H "Cookie: authjs.session-token=TOKEN"
```

### Postman/Insomnia

1. Import the requests from `api-tests.http`
2. Use environment variables for token, IDs
3. Better for file uploads

## Web UI Testing (Recommended)

For most testing, the web UI is easier:

- **Dashboard**: http://localhost:3000/dashboard
- **Patients**: http://localhost:3000/dashboard/patients  
- **Files**: http://localhost:3000/dashboard/files
- **Upload**: http://localhost:3000/dashboard/files/upload

## Security Notes

⚠️ **Important**:
- Never commit `.env` file with real credentials
- Session tokens are sensitive - don't share them
- Passwords are hashed with bcrypt before storage
- Sensitive patient data is encrypted with AES-256

## Database Verification

Check data in Prisma Studio:

```bash
pnpm exec prisma studio
```

This opens a GUI at http://localhost:5555 to view all database tables.

## API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new user | No |
| GET | `/api/patients` | List all patients | Yes |
| POST | `/api/patients` | Create patient | Yes |
| GET | `/api/patients/:id` | Get patient | Yes |
| PATCH | `/api/patients/:id` | Update patient | Yes |
| DELETE | `/api/patients/:id` | Delete patient | Yes |
| GET | `/api/files` | List all files | Yes |
| POST | `/api/files` | Upload file | Yes |
| GET | `/api/files/:id` | Get file | Yes |
| DELETE | `/api/files/:id` | Delete file | Yes |
| POST | `/api/analyze` | Run AI analysis | Yes |
| GET | `/api/analyze` | List inferences | Yes |

## Next Steps

After basic testing:

1. ✅ Test file upload via UI
2. ✅ Test patient detail views
3. ✅ Test data encryption (patient data should be encrypted in DB)
4. ✅ Test authorization (try accessing other users' data)
5. ✅ Test session expiration

Happy testing! 🚀
