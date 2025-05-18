import { Request, Response } from "express";
import admin from "../config/firebase"; // Assicurati di inizializzare Firebase Admin SDK
import User from "../models/UserModel";
import { generateToken } from "../utils/jwt";

export const loginWithFirebase = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("Ricevuta richiesta login con dati:", req.body); // <-- Qui
  try {
    const idToken = req.params.idtoken;
    if (!idToken) {
      res.status(400).json({
        success: false,
        message: "ID token non fornito",
      });
      return;
    }

    // Verifica il token Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({ uid, email, name, role: "user" }); // esempio ruolo di default
    }

    const token = generateToken({
      uid: user.uid,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      token,
      data: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: "Login successful",
    });
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
    return;
  }
};
