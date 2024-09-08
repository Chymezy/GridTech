# Authentication Testing Guide

This document outlines the steps to test the authentication setup for the GridPulse Energy Management Platform server.

## Prerequisites

- The server is running (`npm run dev`)
- Firebase project is set up and configured in `.env`

## Test Cases

### 1. Generate a Custom Token

**Request:**
```
GET http://localhost:3000/
```

**Expected Response:**
- Status: 200 OK
- Body: JSON object containing a `customToken`

**Test Command:**
```bash
curl http://localhost:3000/generate-token
```

### 2. Exchange Custom Token for ID Token

**Request:**
Use the Firebase Authentication REST API

**Test Command:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{
"token":"[CUSTOM_TOKEN]",
"returnSecureToken":true
}' "https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=[YOUR_API_KEY]"
```
Replace `[CUSTOM_TOKEN]` with the token from step 1, and `[YOUR_API_KEY]` with your Firebase Web API Key.

**Expected Response:**
- Status: 200 OK
- Body: JSON object containing `idToken`, `refreshToken`, `expiresIn`

### 3. Access Protected Route with Valid Token

**Request:**
```
GET http://localhost:3000/protected
Authorization: Bearer [ID_TOKEN]
```
```bash
curl -H "Authorization: Bearer [ID_TOKEN]" http://localhost:3000/protected
```

Replace `[ID_TOKEN]` with the token from step 2.

**Expected Response:**
- Status: 200 OK
- Body: JSON object containing a message and user information

### 4. Access Protected Route without Token

**Test Command:**
```bash curl http://localhost:3000/protected```

**Expected Response:**
- Status: 401 Unauthorized
- Body: JSON object with an error message "Not authorized, no token"

### 5. Access Protected Route with Invalid Token

**Test Command:**
```bash
curl -H "Authorization: Bearer invalid_token" http://localhost:3000/protected```
This updated version of AUTHENTICATION_TESTING.md now includes a section explaining how the token is used in the protected route, providing a clearer picture of the authentication flow. It also provides more context for each test case and what to expect from the responses.

**Expected Response:**
- Status: 401 Unauthorized
- Body: JSON object with an error message "Not authorized, token failed"

## How the Token is Used in the Protected Route

1. The client includes the ID token in the Authorization header of the request to the protected route.

2. The `protect` middleware in `src/middleware/auth.ts` intercepts the request:
   - It extracts the token from the Authorization header.
   - It verifies the token using Firebase Admin SDK.
   - If the token is valid, it adds the decoded user information to the request object.

3. The protected route handler in `src/server.ts` can then access the user information:
   ```typescript
   app.get('/protected', protect, (req: AuthenticatedRequest, res: Response) => {
     res.json({ message: 'This is a protected route', user: req.user });
   });
   ```

4. The response includes the user information, demonstrating that the token was successfully verified and the user was authenticated.

## Interpreting Results

- If all tests pass as expected, the authentication system is working correctly.
- Any unexpected responses indicate potential issues in the authentication setup or middleware.

## Troubleshooting

- Ensure all environment variables in `.env` are correctly set.
- Check Firebase console for any issues with your project configuration.
- Verify that the Firebase Admin SDK is initialized correctly in `src/utils/firebaseAdmin.ts`.
- Ensure the `protect` middleware in `src/middleware/auth.ts` is correctly implemented and used in routes.

## Next Steps

After successful testing, consider:
- Implementing user registration and login flows
- Adding more protected routes as needed
- Implementing role-based access control

## User Management Test Cases

### 6. Create a New User

**Request:**
```