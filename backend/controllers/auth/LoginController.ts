import { Request, Response } from "express";
import { auth } from "../../config/firebase";
import Administrator from "../../models/AdministratorModel";
import Client from "../../models/ClientModel";
import Producer from "../../models/ProducerModel";

export const loginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const [producer, client, administrator] = await Promise.all([
      Producer.findOne({ uid: req.body.decodedToken.uid }),
      Client.findOne({ uid: req.body.decodedToken.uid }),
      Administrator.findOne({ uid: req.body.decodedToken.uid }),
    ]);

    if (!producer && !client && !administrator) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (administrator) {
      const payload = {
        uid: administrator.uid,
        email: administrator.email,
        roles: administrator.roles,
      };

      const customToken = await auth.createCustomToken(
        req.body.decodedToken.uid,
        payload,
      );

      res.status(200).json({
        success: true,
        message: "Login successful amministratore",
        data: {
          customToken,
          uid: payload.uid,
          userRole: payload.roles,
        },
      });
      return;
    } else if (producer) {
      const payload = {
        uid: producer.uid,
        name: producer.name || "",
        email: producer.email,
        roles: producer.roles,
      };

      const customToken = await auth.createCustomToken(
        req.body.decodedToken.uid,
        payload,
      );
      res.status(200).json({
        success: true,
        message: "Login successful azienda",
        data: {
          customToken,
          uid: payload.uid,
          name: payload.name,
          userRole: payload.roles,
        },
      });
      return;
    } else if (client) {
      // console.log("Client found:", client);

      const payload = {
        uid: client.uid,
        name: client.username || "",
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
          uid: payload.uid,
          name: payload.name,
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
