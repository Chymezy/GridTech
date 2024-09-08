# GridPulse Energy Management Platform - Server Setup

This document outlines the steps to set up the GridPulse Energy Management Platform server.

## Initial Setup

1. Create a new directory for the project:
   ```bash
   mkdir gridpulse-server
   cd gridpulse-server
   ```

2. Initialize a new Node.js project:
   ```bash
   npm init -y
   ```

3. Install necessary dependencies:
   ```bash
   npm install express mongoose dotenv
   npm install -D typescript @types/express @types/node ts-node nodemon
   ```

4. Initialize TypeScript configuration:
   ```bash
   npx tsc --init
   ```

5. Create a `src` directory and an initial `server.ts` file:
   ```bash
   mkdir src
   touch src/server.ts
   ```

6. Update `package.json` to include start and dev scripts:
   ```json
   {
     "scripts": {
       "start": "node dist/server.js",
       "dev": "nodemon src/server.ts",
       "build": "tsc"
     }
   }
   ```

7. Create a `.env` file in the root directory:
   ```
   PORT=3000
   ```

8. Create a basic Express server in `src/server.ts`:
   ```typescript
   import express from 'express';
   import dotenv from 'dotenv';

   dotenv.config();

   const app = express();
   const port = process.env.PORT || 3000;

   app.get('/', (req, res) => {
     res.send('Welcome to GridPulse Energy Management Platform');
   });

   app.listen(port, () => {
     console.log(`Server running on port ${port}`);
   });
   ```

## Running the Server

To run the server in development mode: