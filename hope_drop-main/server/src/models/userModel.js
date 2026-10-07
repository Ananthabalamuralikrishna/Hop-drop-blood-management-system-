import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    bloodGroup: { type: String, required: true },
    location: { type: String, required: true },
    contactNumber: { type: String, required: true },
    role: { type: String, default: "user" }
  },
  {
    timestamps: true
  }
);

export default model("user", userSchema);