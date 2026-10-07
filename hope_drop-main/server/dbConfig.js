import { connect } from "mongoose";

export async function connectDB(url) {
  try {
    await connect(url);
    console.log("DB Connected");
  } catch (err) {
    console.log(err.message);
  }
}