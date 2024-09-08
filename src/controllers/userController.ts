import { Response, NextFunction } from 'express';
import asyncHandler from '../utils/asyncHandler';
import User, { IUser } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';

// @desc    Create a new user
// @route   POST /api/users
// @access  Private
export const createUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { firebaseUid, email, displayName } = req.body;

  const userExists = await User.findOne({ firebaseUid });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    firebaseUid,
    email,
    displayName
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      displayName: user.displayName
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.uid) {
    res.status(401);
    throw new Error('Not authorized, no user found');
  }

  const user = await User.findOne({ firebaseUid: req.user.uid });

  if (user) {
    res.json({
      _id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      displayName: user.displayName
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});