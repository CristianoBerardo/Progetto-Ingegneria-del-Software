import { Request, Response } from "express";
import Producer from "../models/ProducerModel";
import Product from "../models/ProductModel";
import { generateToken } from "../utils/jwt";

export const createProducer = async (
  req: Request,
  res: Response
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

export const createProducerWithToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const producerData = req.body;
    const newProducer = new Producer(producerData);
    const savedProducer = await newProducer.save();

    const token = generateToken({
      uid: savedProducer._id,
      email: savedProducer.email,
      role: "producer",
    });

    res.status(200).json({
      success: true,
      token,
      message: "Registration successful",
    });
    console.log("New producer created:", savedProducer);
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
  const query = req.query;
  if (Object.keys(query).length > 0) {
    searchProducers(req, res);
    return;
  }

  try {
    const producers = await Producer.find();
    res.status(200).json({
      success: true,
      data: producers,
      message: "Producers retrieved successfully",
    });
    return;
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
    return;
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

    for (const element of deletedProducer.products) {
      await Product.findOneAndDelete(element);
    }

    res.status(200).json({
      success: true,
      data: deletedProducer,
      message: "Producer and relative products are deleted successfully",
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

export const completeUpdateProducer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const producerID = req.params.id;
    if (!producerID) {
      res.status(400).json({
        success: false,
        message: "Producer ID is required",
      });
      return;
    }

    const producerData = req.body;

    if (!producerData) {
      res.status(400).json({
        success: false,
        message: "Producer data is required",
      });
      return;
    }

    const newDocument = await Producer.findByIdAndUpdate(
      producerID,
      producerData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!newDocument) {
      res.status(404).json({
        success: false,
        message: "Producer not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: newDocument,
      message: "Producer updated successfully",
    });
    return;
  } catch (error) {
    console.error("Error updating producer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update producer",
    });
    return;
  }
};

export const partialUpdateProducer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("Partial update producer");

  try {
    const producerID = req.params.id;

    if (!producerID) {
      res.status(400).json({
        success: false,
        message: "Producer ID is required",
      });
      return;
    }

    const producerData = req.body;
    if (!producerData) {
      res.status(400).json({
        success: false,
        message: "Producer data is required",
      });
      return;
    }

    const updatedProducer = await Producer.findByIdAndUpdate(
      producerID,
      producerData,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedProducer) {
      res.status(404).json({
        success: false,
        message: "Producer not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: updatedProducer,
      message: "Producer partially updated successfully",
    });
    return;
  } catch (error) {
    console.error("Error partially updating producer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to partially update producer",
    });
    return;
  }
};

//* ------------------ SEARCH ------------------ *//

export const searchProducers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, sort = "name:asc", page = 1, limit = 10 } = req.query;

  try {
    const sortOption: any = {};
    if (sort) {
      //MongoDB conventions --> 1 for ascending, -1 for descending
      const [field, order] = String(sort).split(":");
      sortOption[field] = order === "desc" ? -1 : 1;
    }

    const producers = await Producer.find({
      name: { $regex: name, $options: "i" },
    })
      .sort(sortOption)
      // .populate("products")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    if (producers.length === 0) {
      res.status(404).json({
        success: false,
        message: "No producers found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: producers,
      message: "Producers retrieved successfully",
    });
    return;
  } catch (error) {
    console.error("Error searching producers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search producers",
    });
    return;
  }
};

//* ------------------ GET NAMES ------------------ *//

export const getProducerNames = async (req: Request, res: Response) => {
  try {
    const producers = await Producer.find(
      {},
      {
        name: 1,
        _id: 1,
      }
    );

    if (!producers) {
      res.status(404).json({
        success: false,
        message: "No producers found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: producers,
      message: "Producer names retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving producer names:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve producer names",
    });
    return;
  }
};
