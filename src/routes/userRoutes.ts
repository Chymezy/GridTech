import express from 'express';
import { createUser, getUserProfile } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createUser);
router.get('/profile', protect, getUserProfile);

export default router;