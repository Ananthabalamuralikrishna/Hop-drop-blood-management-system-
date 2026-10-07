import { Schema, model, Types } from "mongoose";

const requestSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "user",
      required: true
    },
    bloodGroup: {
      type: String,
      required: true
    },
    units: {
      type: Number,
      required: true
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low"
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    acceptedHospital: {
      type: Types.ObjectId,
      ref: "hospital"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    rejectedBy: [{
      type: Schema.Types.ObjectId,
      ref: "hospital"
    }]

  },
  {
    timestamps: true
  }
);

export default model("request", requestSchema);