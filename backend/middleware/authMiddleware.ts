import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";

export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
      return;
    }
    const firebaseToken = authHeader.split("Bearer ")[1];

    try {
      
      const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
      req.body.decodedToken = decodedToken;

      console.log("DECOADED TOKEN", decodedToken);
      next();

    } catch (error) {
      console.error("Error verifying Firebase token:", error);
      res
        .status(403)
        .json({ success: false, message: "Forbidden: Invalid token" });
      return;
    }

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};
