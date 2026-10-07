import { Schema, model } from "mongoose";

const hospitalSchema = new Schema(
  {
    hospitalName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    licenseID: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    contactNumber: { type: String, required: true },
    role: { type: String, default: "hospital" }
  },
  {
    timestamps: true
  }
);

export default model("hospital", hospitalSchema);