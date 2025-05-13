import express, { Request, Response } from "express";
import { connectToMongoDB } from "./connections/mongoDB/connections";
import Producer from "./models/ProducerModel";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

export async function startServer() {
  try {
    await connectToMongoDB();

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    throw new Error("Failed to start the server");
  }
}

export const createProducer = async (req: Request, res: Response) => {
  try {
    const producerData = req.body;
    console.log(producerData);
    const newProducer = new Producer(producerData);
    const savedProducer = await newProducer.save();
    res.status(201).json({
      success: true,
      data: savedProducer,
      message: "Producer created successfully",
    });
  } catch (error) {
    console.error("Error creating producer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create producer",
    });
  }
};

startServer();

app.post("/api/producers", createProducer);
