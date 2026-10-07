import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();
const secret = process.env.SECRET_KEY || "BBMS";

/* ---------- AUTH MIDDLEWARE ---------- */
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const err = new Error("Authorization token missing");
      err.statusCode = 401;
      throw err;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, secret);

    // decoded contains: { _id, role }
    req.user = decoded;

    next();
  } catch (err) {
    err.statusCode = err.statusCode || 401;
    next(err);
  }
};
