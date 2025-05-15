import { Request, Response } from "express";
import Producer from "../models/ProducerModel";

export const createProducer = async (
  req: Request,
  res: Response,
): Promise<void> => {
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
    return;
  } catch (error) {
    console.error("Error creating producer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create producer",
    });
  }
};

export const readProducers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const producers = await Producer.find();
    res.status(200).json({
      success: true,
      data: producers,
      message: "Producers retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving producers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve producers",
    });
    return;
  }
};

export const readProducer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const producerId = req.params.id;
    const producer = await Producer.findById(producerId);
    if (!producer) {
      res.status(404).json({
        success: false,
        message: "Producer not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: producer,
      message: "Producer retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving producer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve producer",
    });
    return;
  }
};

export const deleteProducer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const producerId = req.params.id;
    const deletedProducer = await Producer.findByIdAndDelete(producerId);
    if (!deletedProducer) {
      res.status(404).json({
        success: false,
        message: "Producer not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: deletedProducer,
      message: "Producer deleted successfully",
    });
    return;
  } catch (error) {
    console.error("Error deleting producer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete producer",
    });
    return;
  }
};
