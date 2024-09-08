# Project Structure and Database Setup

This document outlines the steps to set up the project structure and MongoDB connection for the GridPulse Energy Management Platform server.

## Project Structure Setup

1. Create necessary directories:
   ```bash
   mkdir src/models src/controllers src/routes src/services src/utils
   ```

## MongoDB Connection Setup

1. Install mongoose (if not already installed):
   ```bash
   npm install mongoose
   ```

2. Update the `.env` file to include the MongoDB connection string:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/gridpulse
   ```

3. Create a new file `src/utils/database.ts`:
   ```typescript
   import mongoose from 'mongoose';
   import dotenv from 'dotenv';

   dotenv.config();

   const connectDB = async (): Promise<void> => {
     try {
       const conn = await mongoose.connect(process.env.MONGODB_URI as string);
       console.log(`MongoDB Connected: ${conn.connection.host}`);
     } catch (error) {
       console.error('Error connecting to MongoDB:', error);
       process.exit(1);
     }
   };

   export default connectDB;
   ```

4. Update `src/server.ts` to use the database connection:
   ```typescript
   import express from 'express';
   import dotenv from 'dotenv';
   import connectDB from './utils/database';

   dotenv.config();

   const app = express();
   const port = process.env.PORT || 3000;

   connectDB();

   app.get('/', (req, res) => {
     res.send('Welcome to GridPulse Energy Management Platform');
   });

   app.listen(port, () => {
     console.log(`Server running on port ${port}`);
   });
   ```

## Testing the Setup

1. Ensure MongoDB is running on your local machine or update the MONGODB_URI to point to your MongoDB instance.

2. Run the server in development mode:
   ```bash
   npm run dev
   ```

3. Check the console output. You should see messages indicating that the server is running and MongoDB is connected.

If you encounter any issues, ensure that MongoDB is installed and running, and that the connection string in the `.env` file is correct.