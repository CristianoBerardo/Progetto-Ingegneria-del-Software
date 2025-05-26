import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import Client from "../models/ClientModel";
import Producer from "../models/ProducerModel";
import { TokenPayload } from "../types/auth/TokenPayload";
import { generateToken } from "../utils/jwt";
import admin from "../config/firebase";

export const createProducerWithToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log("NEW create Producer Token")
    const producerData = req.body;
    const newProducer = new Producer(producerData);
    const savedProducer = await newProducer.save();

    const token = generateToken({
      uid: savedProducer.uid,
      _id: savedProducer._id,
      email: savedProducer.email,
      role: savedProducer.roles.enum,
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


export const registerController = async(
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { idToken } = req.params;

    // Verify Firebase token
    
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid } = decodedToken;
    req.body.uid = uid;
    req.body.products = []

    await createProducerWithToken(req, res);
    
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
}

export const loginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // ! Essendo una post ci deve essere il body e non il params
    // const { firebaseToken } = req.body;

    const { idToken } = req.params;

    const auth = getAuth();

    const decodedToken = await auth.verifyIdToken(idToken);

    const producer = await Producer.findById(decodedToken.uid);
    console.log("qui1");
    const client = await Client.findById(decodedToken.uid);
    console.log("qui2");

    // da decidere se creare un altro DB per gli admin o meno
    // const admin = await Admin.findOne({
    //   uid: decodedToken.uid,
    // });

    if (!producer && !client) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (producer) {
      const payload: TokenPayload = {
        uid: producer.id,
        email: producer.email,
        roles: producer.roles.enum,
      };

      const customToken = await auth.createCustomToken(
        decodedToken.uid,
        payload,
      );
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          customToken,
        },
      });
      return;
    } else if (client) {
      const payload: TokenPayload = {
        uid: client.id,
        email: client.email,
        roles: client.roles.enum,
      };

      const customToken = await auth.createCustomToken(
        decodedToken.uid,
        payload,
      );
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          customToken,
        },
      });
      return;
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};
