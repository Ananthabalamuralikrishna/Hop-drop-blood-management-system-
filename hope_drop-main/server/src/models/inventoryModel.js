import { Schema, model, Types } from "mongoose";

const inventorySchema = new Schema(
  {
    hospitalId: {
      type: Types.ObjectId,
      ref: "hospital",
      required: true
    },
    bloodGroup: {
      type: String,
      required: true
    },
    units: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default model("inventory", inventorySchema);