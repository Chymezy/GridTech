import mongoose from 'mongoose';
import User from '../models/User';

describe('User Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/testdb');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

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

  // Add more tests...
});