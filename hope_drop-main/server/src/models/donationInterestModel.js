import { Schema, model, Types } from "mongoose";

const donationInterestSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "user",
      required: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 65
    },
    weight: {
      type: Number,
      required: true,
      min: 45
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      trim: true,
      default: ""
    },
    contactNumber: {
      type: String,
      required: true
    },
    availabilityDate: {
      type: Date,
      required: true
    },
    lastDonationDate: {
      type: Date,
      default: null,
      required: true
    },
    healthConditions: {
      type: String,
      trim: true,
      default: ""
    },
    isSmoker: {
      type: Boolean,
      required: true
    },
    consumesAlcohol: {
      type: Boolean,
      required: true
    },
    status: {
      type: String,
      enum: ["available", "contacted", "donated"],
      default: "available"
    }
  },
  { timestamps: true }
);

export default model("donationInterest", donationInterestSchema);

