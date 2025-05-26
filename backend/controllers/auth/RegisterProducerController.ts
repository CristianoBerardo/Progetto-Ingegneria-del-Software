import { Request, Response } from "express";
import admin from "../../config/firebase";
import Producer from "../../models/ProducerModel";
import { generateToken } from "../../utils/jwt";

export const registerProducerController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const body = req.body;
    const producerData = {
      uid: body.decodedToken.uid,
      products: [],
      ...body, // not the best because there is all the decodedToken (req.body.decodedToken) inside the body
    };

    const newProducer = new Producer(producerData);
    const savedProducer = await newProducer.save();

    await admin
      .auth()
      .setCustomUserClaims(req.body.decodedToken.uid, { role: "producer" });

    const token = generateToken({
      uid: savedProducer.uid,
      email: savedProducer.email,
      role: "producer",
    });

    res.status(201).json({
      success: true,
      message: "Producer registration successful",
      data: {
        token,
        userRole: savedProducer.roles,
      },
    });
    console.log("New producer created:", savedProducer);
    return;
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};
