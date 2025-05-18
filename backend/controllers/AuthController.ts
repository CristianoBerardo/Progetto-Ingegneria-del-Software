import { Request, Response } from "express";
import admin from "../config/firebase";
import { createProducerWithToken } from "./ProducerController";
import { generateToken } from "../utils/jwt";

export const registerWithFirebase = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.params;
    const { userType, name, phone, address, email } = req.body;

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid } = decodedToken;

    // Create new Producer in the database
    if (userType === "azienda") {
      req.body.products = [];
      req.body.uid = uid;
      await createProducerWithToken(req, res);
      return;
    }
    
    // else if (userType === "client") {
    //   let user = await User.findOne({ uid });
    //   if (!user) {
    //     user = await User.create({ uid, email, name, role: "user" }); // esempio ruolo di default
    //   }
    // }

    // // Generate JWT token
    // const token = generateToken({
    //   uid: uid,
    //   email: email,
    //   role: userType,
    // });

    // res.status(200).json({
    //   success: true,
    //   token,
    //   data: {
    //     uid: uid,
    //     email: email,
    //     name: name,
    //     role: userType,
    //   },
    //   message: "Registration successful",
    // });
    console.log("User logged in:", email);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
    return;
  }
};

export const loginWithFirebase = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.params;
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Controlla se l'utente esiste nel database (opzionale)
    // const user = await User.findOne({ uid });
    // if (!user) {
    //   return res.status(404).json({ success: false, message: "Utente non trovato" });
    // }

    // Generate JWT token
    const token = generateToken({ uid, email, role: "user" });

    // Send JWT token back to the client
    res.status(200).json({
      success: true,
      token,
      message: "Login effettuato con successo",
    });
    console.log("User logged in:", email);
  } catch (error) {
    console.error("Errore durante il login:", error);
    res.status(500).json({
      success: false,
      message: "Errore durante il login",
    });
  }
};