import express from "express";
import { config } from "dotenv";
import cors from "cors";

import { connectDB } from "./dbConfig.js";
import { logger } from "./src/middleware/logger.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

import { userRoute } from "./src/routes/userRoutes.js";
import { hospitalRoute } from "./src/routes/hospitalRoues.js";
import { requestRoute } from "./src/routes/requestRoutes.js";
import { inventoryRoute } from "./src/routes/inventoryRoutes.js";
import { donationRoute } from "./src/routes/donationRoutes.js";

const app = express();
config();

const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file");
  process.exit(1);
}

/* ---------- Global Middlewares ---------- */
app.use(cors());
app.use(express.json());
app.use(logger);

/* ---------- Routes ---------- */
app.use("/api/auth/users", userRoute);
app.use("/api/auth/hospitals", hospitalRoute);
app.use("/api/auth/inventory", inventoryRoute);
app.use("/api/auth/requests", requestRoute);
app.use("/api/auth/donations", donationRoute);

/* ---------- Error Handler ---------- */
app.use(errorHandler);

/* ---------- DB Connection + Server ---------- */
connectDB(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running @ http://localhost:${port}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
  });