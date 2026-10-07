import express from "express";
import {
  createRequest,
  getActiveRequests,
  acceptRequest,
  rejectRequest
} from "../controllers/requestController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const requestRoute = express.Router();

requestRoute.post("/add", authMiddleware, createRequest); // user creates request
requestRoute.get("/active", authMiddleware, getActiveRequests); // only active requests for hospitals
requestRoute.patch("/accept/:requestId", authMiddleware, acceptRequest); // hospital approves
requestRoute.patch("/reject/:requestId", authMiddleware, rejectRequest); // hospital rejects

export { requestRoute };