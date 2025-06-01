import { Request, Response } from "express";
import admin from "../../config/firebase";
import Client from "../../models/ClientModel";
import { generateToken } from "../../utils/jwt";

export const registerClientController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = req.body;
    const clientData = {
      uid: data.decodedToken.uid,
      ...data, // not ideal because there is all the decodedToken (req.body.decodedToken) inside the body
    };
    // console.log("Client data received:", clientData);

    const newClient = new Client(clientData);
    const savedClient = await newClient.save();

    await admin
      .auth()
      .setCustomUserClaims(req.body.decodedToken.uid, { role: "client" });

    const token = generateToken({
      uid: savedClient.uid,
      _id: savedClient._id,
      email: savedClient.email,
      roles: savedClient.roles,
    });

    res.status(200).json({
      success: true,
      message: "Registration successful",
      data: {
        token,
        userRole: savedClient.roles,
      },
    });
    // console.log("New client client:", savedClient);
    return;
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create client",
    });
  }
};
