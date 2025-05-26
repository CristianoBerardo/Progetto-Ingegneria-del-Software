import { Request, Response } from "express";
import admin from "../../config/firebase";
import { createProducerWithToken } from "../ProducerController";
import { generateToken } from "../../utils/jwt";
import { createClientWithToken } from "../ClientController";

export const registerClient = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.params;

    // Verify token Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid } = decodedToken;
    req.body.uid = uid;

    // Create client inside database
    await createClientWithToken(req, res);
  } catch (error) {
    console.error("Errore during database registration:", error);
    res.status(500).json({
      success: false,
      message: "Error during database registration",
    });
  }
};

export const registerProducer = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.params;

    // Verify token Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid } = decodedToken;
    req.body.uid = uid;
    req.body.products = [];

    // Crea il produttore nel database
    await createProducerWithToken(req, res);
  } catch (error) {
    console.error("Error during database registration:", error);
    res.status(500).json({
      success: false,
      message: "Errore during database registration",
    });
  }
};

export const loginWithFirebase = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.params;
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Generate JWT token
    const token = generateToken({ uid, email });

    // Send JWT token back to the client
    res.status(200).json({
      success: true,
      token,
      message: "Login effettuato con successo",
    });
    console.log("User logged in:", email);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Errore during login",
    });
  }
};
