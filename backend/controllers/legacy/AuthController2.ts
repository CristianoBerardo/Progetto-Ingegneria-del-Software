import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import admin from "../../config/firebase";
import Client from "../../models/ClientModel";
import Producer from "../../models/ProducerModel";
import { generateToken } from "../../utils/jwt";

// export const registerClientController = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const data = req.body;
//     const clientData = {
//       uid: data.decodedToken.uid,
//       ...data, // not the best because there is all the decodedToken (req.body.decodedToken) inside the body
//     };
//     console.log("Client data received:", clientData);

//     const newClient = new Client(clientData);
//     const savedClient = await newClient.save();

//     await admin
//       .auth()
//       .setCustomUserClaims(req.body.decodedToken.uid, { role: "client" });

//     const token = generateToken({
//       uid: savedClient.uid,
//       _id: savedClient._id,
//       email: savedClient.email,
//       roles: savedClient.roles,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Registration successful",
//       data: {
//         token,
//         userRole: savedClient.roles,
//       },
//     });
//     console.log("New client client:", savedClient);
//     return;
//   } catch (error) {
//     console.error("Error creating client:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create client",
//     });
//   }
// };

// export const registerProducerController = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const body = req.body;
//     const producerData = {
//       uid: body.decodedToken.uid,
//       products: [],
//       ...body, // not the best because there is all the decodedToken (req.body.decodedToken) inside the body
//     };

//     const newProducer = new Producer(producerData);
//     const savedProducer = await newProducer.save();

//     await admin
//       .auth()
//       .setCustomUserClaims(req.body.decodedToken.uid, { role: "producer" });

//     const token = generateToken({
//       uid: savedProducer.uid,
//       email: savedProducer.email,
//       role: "producer",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Producer registration successful",
//       data: {
//         token,
//         userRole: savedProducer.roles,
//       },
//     });
//     console.log("New producer created:", savedProducer);
//     return;
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//     return;
//   }
// };

export const loginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // ! Essendo una post ci deve essere il body e non il params
    // const { firebaseToken } = req.body;

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
