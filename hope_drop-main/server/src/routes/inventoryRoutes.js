import express from "express";
import {
  getInventory,
  incrementInventory,
  decrementInventory
} from "../controllers/inventoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const inventoryRoute = express.Router();

inventoryRoute.get("/", authMiddleware, getInventory); // fetch inventory for logged-in hospital
inventoryRoute.patch("/increment", authMiddleware, incrementInventory); // + button
inventoryRoute.patch("/decrement", authMiddleware, decrementInventory); // - button


export { inventoryRoute };