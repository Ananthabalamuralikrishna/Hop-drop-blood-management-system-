import express from "express";
import {
  createHospital,
  loginHospital
} from "../controllers/hospitalController.js";

const hospitalRoute = express.Router();

hospitalRoute.post("/signup", createHospital);
hospitalRoute.post("/login", loginHospital);


export { hospitalRoute };
