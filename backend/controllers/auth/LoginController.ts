import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import admin from "../../config/firebase";
import Client from "../../models/ClientModel";
import Producer from "../../models/ProducerModel";

export const loginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const auth = getAuth();

    const [producer, client] = await Promise.all([
      Producer.findOne({ uid: req.body.decodedToken.uid }),
      Client.findOne({ uid: req.body.decodedToken.uid }),
    ]);

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
      const payload = {
        uid: producer.id,
        email: producer.email,
        roles: producer.roles,
      };

      const customToken = await admin
        .auth()
        .createCustomToken(req.body.decodedToken.uid, payload);
      res.status(200).json({
        success: true,
        message: "Login successful azienda",
        data: {
          customToken,
          userRole: payload.roles,
        },
      });
      return;
    } else if (client) {
      console.log("Client found:", client);

      const payload = {
        uid: client.id,
        email: client.email,
        roles: client.roles,
      };

      // console.log("Payload:", payload);

      const customToken = await auth.createCustomToken(
        req.body.decodedToken.uid,
        payload,
      );
      res.status(200).json({
        success: true,
        message: "Login successful cliente",
        data: {
          customToken,
          userRole: payload.roles,
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
