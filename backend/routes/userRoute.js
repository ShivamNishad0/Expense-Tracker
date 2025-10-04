import express from "express";
import User from "../models/userModel.js";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  updatePassword,
 getUserProfile
} from "../controllers/userController.js";

import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

// Public Routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Private Routes
userRouter.get('/me', authMiddleware, getCurrentUser);
userRouter.put('/profile', authMiddleware, updateUserProfile);
userRouter.put('/password', authMiddleware, updatePassword);
userRouter.put('/profile/:id', authMiddleware, getUserProfile);

export default userRouter;