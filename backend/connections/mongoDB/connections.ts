import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const URIMongoDB = process.env.MONGODB_URI;

export async function connectToMongoDB() {
  try {
    if (!URIMongoDB) {
      console.log("MongoDB connection string is not defined or wrong");
      throw new Error("MongoDB connection string is not defined");
    }

    await mongoose.connect(URIMongoDB, {
      dbName: "agritrento",
    });

    console.log("Connected to MongoDB");

    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}

export async function disconnectFromMongoDB() {
  try {
    if (!mongoose.connection) {
      console.log("MongoDB connection is not established");
    } else {
      await mongoose.disconnect();
    }
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    throw new Error("Failed to disconnect from MongoDB");
  }
}

export const databaseProducts = URIMongoDB;
