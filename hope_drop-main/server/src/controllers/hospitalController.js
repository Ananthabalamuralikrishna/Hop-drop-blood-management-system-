import Hospital from "../models/hospitalModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();
const secret = process.env.SECRET_KEY || "BBMS";

/* CREATE HOSPITAL (SIGNUP) */
export const createHospital = async (req, res, next) => {
  try {
    const {
      hospitalName,
      email,
      password,
      licenseID,
      location,
      contactNumber
    } = req.body;

    // Required field validation
    if (
      !hospitalName ||
      !email ||
      !password ||
      !licenseID ||
      !location ||
      !contactNumber
    ) {
      const err = new Error("Required fields are missing!");
      err.statusCode = 400;
      throw err;
    }

    // Check existing hospital (email or license)
    const existingHospital = await Hospital.findOne({
      $or: [{ email }, { licenseID }]
    });

    if (existingHospital) {
      const err = new Error("Hospital already exists!");
      err.statusCode = 409;
      throw err;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newHospital = new Hospital({
      hospitalName,
      email,
      password: hashedPassword,
      licenseID,
      location,
      contactNumber,
      role: "hospital"
    });

    const savedHospital = await newHospital.save();

    // Remove password from response
    const { password: pwd, ...hospitalData } = savedHospital._doc;

    // Issue JWT so newly registered hospital is authenticated immediately
    const token = jwt.sign(
      { _id: hospitalData._id, role: hospitalData.role },
      secret,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Hospital registered successfully",
      token,
      hospital: hospitalData
    });
  } catch (err) {
    next(err);
  }
};

/* LOGIN HOSPITAL */
export const loginHospital = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Email and password are required!");
      err.statusCode = 400;
      throw err;
    }

    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      const err = new Error("Invalid email or password!");
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      const err = new Error("Invalid email or password!");
      err.statusCode = 401;
      throw err;
    }

    const token = jwt.sign(
      { _id: hospital._id, role: hospital.role },
      secret,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      hospital: {
        _id: hospital._id,
        hospitalName: hospital.hospitalName,
        email: hospital.email,
        role: hospital.role
      }
    });
  } catch (err) {
    next(err);
  }
};