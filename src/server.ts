import express, { Response } from 'express';
import { Request as ExpressRequest } from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/database';
import { protect } from './middleware/auth';
import admin from './utils/firebaseAdmin';
import userRoutes from './routes/userRoutes';
import { errorHandler, notFound } from './middleware/errorMiddleware';

interface AuthenticatedRequest extends ExpressRequest {
  user?: any;
}

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.get('/', (req: ExpressRequest, res: Response) => {
  res.send('Welcome to GridPulse Energy Management Platform');
});

// Use user routes
app.use('/api/users', userRoutes);

// New route for generating a test token
app.get('/generate-token', async (req: ExpressRequest, res: Response) => {
  try {
    const uid = 'test-user-id';
    const customToken = await admin.auth().createCustomToken(uid);
    res.json({ customToken });
  } catch (error) {
    console.error('Error generating custom token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});