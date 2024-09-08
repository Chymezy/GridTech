import { Response, NextFunction } from 'express';
import { Request as ExpressRequest } from 'express';
import asyncHandler from 'express-async-handler';
import admin from '../utils/firebaseAdmin';

export interface AuthenticatedRequest extends ExpressRequest {
  user?: admin.auth.DecodedIdToken;
}

export const protect = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
      const err = new Error('Not authorized, token failed') as any;
      err.statusCode = 401;
      next(err);
    }
  }

  if (!token) {
    const err = new Error('Not authorized, no token') as any;
    err.statusCode = 401;
    next(err);
  }
});