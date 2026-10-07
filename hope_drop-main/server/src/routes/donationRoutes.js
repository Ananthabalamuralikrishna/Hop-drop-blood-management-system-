import express from "express";
import {
  createDonation,
  getMyDonations,
  getDonationsForHospital
} from "../controllers/donationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const donationRoute = express.Router();

donationRoute.post("/create", authMiddleware, createDonation);          /* user submits donation */
donationRoute.get("/my", authMiddleware, getMyDonations);               /* user views own donations */
donationRoute.get("/hospital", authMiddleware, getDonationsForHospital);/* hospital dashboard donation list */

export { donationRoute };