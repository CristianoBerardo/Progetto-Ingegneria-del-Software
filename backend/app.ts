import { connectToMongoDB } from "./connections/mongoDB/connections";

export async function startServer() {
  try {
    await connectToMongoDB();
  } catch (error) {
    console.error("Error starting the server:", error);
    throw new Error("Failed to start the server");
  }
}

startServer()
