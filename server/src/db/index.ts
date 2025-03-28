import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\nMongoDB Connected Successfully , DB Host:${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.log("ERROR : MongoDb Connection Error - ", err);
    process.exit(1);
  }
};

export default connectDB;
