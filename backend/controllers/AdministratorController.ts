import { Request, Response } from "express";
import Administrator from "../models/AdministratorModel";
import { generateToken } from "../utils/jwt";
import { Role } from "../types/Role";
import { auth } from "../config/firebase";


export const createAdministrator = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const AdministratorData = req.body;
    const newAdmin = new Administrator(AdministratorData);
    const savedAdmin = await newAdmin.save();

    const token = generateToken({
      uid: savedAdmin._id,
      email: savedAdmin.email,
      role: Role.administrator,
    });

    res.status(200).json({
      success: true,
      token,
      message: "Registration successful",
    });
    
    console.log("New admin created:", savedAdmin);
    return;
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create client",
    });
  }
};

export const readAdministrator = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const clientId = req.params.id;
    const client = await Administrator.findById(clientId);
    if (!client) {
      res.status(404).json({
        success: false,
        message: "Client not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: client,
      message: "Client retrieved successfully",
    });
    return;
  } catch (error) {
    console.error("Error retrieving client:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve client",
    });
    return;
  }
};
