import express from "express";
import {
  createUser,
  loginUser,
  getUserRequests
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRoute = express.Router();

userRoute.post("/register", createUser);
userRoute.post("/login", loginUser);
userRoute.get("/requests", authMiddleware, getUserRequests); // userId taken from JWT


export { userRoute };