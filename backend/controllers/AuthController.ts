import { Request, Response } from "express";
import admin from "../config/firebase"; 
import User from "../models/UserModel";
import Producer from "../models/ProducerModel"; 
import { generateToken } from "../utils/jwt";
import { createProducer } from "./ProducerController";

export const registerWithFirebase = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.params;
    const { userType, name, phone, address, email } = req.body;

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid } = decodedToken;

    // Generate new Producer or User 
    if (userType === "azienda") {
      req.body.products = [];
      req.body.uid = uid;
      await createProducer(req, res);
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

export const loginWithFirebase = async (req: Request, res: Response) => {/*
  try {
    const { idToken } = req.params;
    const { userType, name, phone, address, email } = req.body;

    // Verifica il token Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid } = decodedToken;

    if (userType === "azienda") {
      let producer = await Producer.findOne({ uid });
      if (!producer) {
        producer = await User.create({ uid, email, name, role: "user" }); // esempio ruolo di default
      }
      return;
    }

    // defautl userType
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
    console.log("User logged in:", user.email);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
    return;
  }*/
};
