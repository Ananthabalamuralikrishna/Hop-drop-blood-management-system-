import User from "../models/userModel.js";
import Request from "../models/requestModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();
const secret = process.env.SECRET_KEY || "BBMS";

/* CREATE USER (SIGNUP) */
export const createUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      bloodGroup,
      location,
      contactNumber,
    } = req.body;

    // Required field validation
    if (
      !name ||
      !email ||
      !password ||
      !bloodGroup ||
      !location ||
      !contactNumber
    ) {
      const err = new Error("Required fields are missing!");
      err.statusCode = 400;
      throw err;
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const err = new Error("User already exists!");
      err.statusCode = 409;
      throw err;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      bloodGroup,
      location,
      contactNumber,
      role: "user",
    });

    const savedUser = await newUser.save();

    // Remove password from response
    const { password: pwd, ...userData } = savedUser._doc;

    // Issue JWT so newly registered user is authenticated immediately
    const token = jwt.sign(
      { _id: userData._id, role: userData.role },
      secret,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userData,
    });
  } catch (err) {
    next(err);
  }
};

/* LOGIN USER */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Email and password are required!");
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("Invalid email or password!");
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Invalid email or password!");
      err.statusCode = 401;
      throw err;
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      secret,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    next(err);
  }
};

/* GET USER REQUESTS
   (middleware will add req.user) */
export const getUserRequests = async (req, res, next) => {
  try {
    const userId = req.user._id; // will work after auth middleware

    const requests = await Request.find({ userId }).populate("acceptedHospital", "hospitalName").sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    next(err);
  }
};
