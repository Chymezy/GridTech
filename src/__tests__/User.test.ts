import mongoose from 'mongoose';
import User from '../models/User';
import { connectDB } from '../utils/testDbConnect';
import { createUser, getUserProfile } from '../controllers/userController';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

describe('User Model and Controller Test', () => {
  beforeAll(async () => {
    await connectDB();
  }, 30000);

  afterAll(async () => {
    await mongoose.connection.close();
  }, 30000);

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('User Model', () => {
    it('should create & save user successfully', async () => {
      const validUser = new User({
        firebaseUid: 'testuid123',
        email: 'test@example.com',
        displayName: 'Test User'
      });
      const savedUser = await validUser.save();
      
      expect(savedUser._id).toBeDefined();
      expect(savedUser.firebaseUid).toBe(validUser.firebaseUid);
      expect(savedUser.email).toBe(validUser.email);
      expect(savedUser.displayName).toBe(validUser.displayName);
    });

    it('should fail to create a duplicate user', async () => {
      const userData = {
        firebaseUid: 'testuid456',
        email: 'test2@example.com',
        displayName: 'Test User 2'
      };
      await User.create(userData);

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('User Controller', () => {
    it('should create a new user', async () => {
      const req = {
        body: {
          firebaseUid: 'testuid789',
          email: 'test3@example.com',
          displayName: 'Test User 3'
        }
      } as AuthenticatedRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const next: NextFunction = jest.fn();

      await createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        firebaseUid: 'testuid789',
        email: 'test3@example.com',
        displayName: 'Test User 3'
      }));
    });

    it('should get user profile', async () => {
      const user = await User.create({
        firebaseUid: 'testuid101',
        email: 'test4@example.com',
        displayName: 'Test User 4'
      });

      const req = {
        user: { uid: 'testuid101' }
      } as AuthenticatedRequest;

      const res = {
        json: jest.fn()
      } as unknown as Response;

      const next: NextFunction = jest.fn();

      await getUserProfile(req, res, next);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        firebaseUid: 'testuid101',
        email: 'test4@example.com',
        displayName: 'Test User 4'
      }));
    });

    it('should return 404 for non-existent user', async () => {
      const req = {
        user: { uid: 'nonexistentuid' }
      } as AuthenticatedRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const next: NextFunction = jest.fn();

      await expect(getUserProfile(req, res, next)).rejects.toThrow('User not found');
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});