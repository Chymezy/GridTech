# Authentication Setup

This document outlines the steps to set up Firebase Authentication for the GridPulse Energy Management Platform server.

## Firebase Admin SDK Setup

1. Install necessary packages:
   ```bash
   npm install firebase-admin express-async-handler
   ```

2. Create a new file `src/utils/firebaseAdmin.ts`:
   ```typescript
   import * as admin from 'firebase-admin';
   import dotenv from 'dotenv';

   dotenv.config();

   const serviceAccount: admin.ServiceAccount = {
     projectId: process.env.FIREBASE_PROJECT_ID,
     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
   };

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
   });

   export default admin;
   ```

3. Create a new file `src/middleware/auth.ts`:
   ```typescript
   import { Request, Response, NextFunction } from 'express';
   import asyncHandler from 'express-async-handler';
   import admin from '../utils/firebaseAdmin';

   export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
     let token;

     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
       try {
         // Get token from header
         token = req.headers.authorization.split(' ')[1];

         // Verify token
         const decodedToken = await admin.auth().verifyIdToken(token);

         // Add user from payload
         req.user = decodedToken;

         next();
       } catch (error) {
         console.error(error);
         res.status(401);
         throw new Error('Not authorized, token failed');
       }
     }

     if (!token) {
       res.status(401);
       throw new Error('Not authorized, no token');
     }
   });
   ```

4. Create a new file `src/types/express/index.d.ts`:
   ```typescript
   import { DecodedIdToken } from 'firebase-admin/auth';

   declare global {
     namespace Express {
       interface Request {
         user?: DecodedIdToken;
       }
     }
   }
   ```

5. Update `tsconfig.json` to include the new type definition:
   ```json
   {
     "compilerOptions": {
       // ... other options ...
       "typeRoots": ["./node_modules/@types", "./src/types"]
     },
     // ... other configurations ...
   }
   ```

6. Update the `.env` file to include Firebase configuration:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY="your-private-key"
   ```

7. Update `src/server.ts` to use the authentication middleware:
   ```typescript
   import express from 'express';
   import dotenv from 'dotenv';
   import connectDB from './utils/database';
   import { protect } from './middleware/auth';

   dotenv.config();

   const app = express();
   const port = process.env.PORT || 3000;

   connectDB();

   app.get('/', (req, res) => {
     res.send('Welcome to GridPulse Energy Management Platform');
   });

   app.get('/protected', protect, (req, res) => {
     res.json({ message: 'This is a protected route', user: req.user });
   });

   app.listen(port, () => {
     console.log(`Server running on port ${port}`);
   });
   ```

## Testing the Setup

1. Obtain a valid Firebase ID token from a client application.
2. Use this token to make a request to the `/protected` route:
   ```
   GET http://localhost:3000/protected
   Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
   ```
3. If successful, you should receive a JSON response with a message and user information.

Ensure to keep your Firebase configuration in the `.env` file secure and never commit it to version control.