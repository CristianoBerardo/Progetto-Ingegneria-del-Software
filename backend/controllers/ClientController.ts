import { Request, Response } from "express";
import Client from "../models/ClientModel";
import { generateToken } from "../utils/jwt";

export const createClient = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const clientData = req.body;
    console.log(clientData);
    const newClient = new Client(clientData);
    const savedClient = await newClient.save();
    res.status(201).json({
      success: true,
      data: savedClient,
      message: "Client created successfully",
    });
    return;
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create client",
    });
  }
};

export const createClientWithToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const ClientData = req.body;
    const newClient = new Client(ClientData);
    const savedClient = await newClient.save();

    const token = generateToken({
      uid: savedClient._id,
      email: savedClient.email,
      role: "client",
    });

    res.status(200).json({
      success: true,
      token,
      message: "Registration successful",
    });
    console.log("New client created:", savedClient);
    return;
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create client",
    });
  }
};

export const readClients = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const clients = await Client.find();
    res.status(200).json({
      success: true,
      data: clients,
      message: "Clients retrieved successfully",
    });
    return;
  } catch (error) {
    console.error("Error retrieving clients:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve clients",
    });
    return;
  }
};

export const readClient = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const clientId = req.params.id;
    const client = await Client.findById(clientId);
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

export const deleteClient = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const clientId = req.params.id;
    const deletedClient = await Client.findByIdAndDelete(clientId);
    if (!deletedClient) {
      res.status(404).json({
        success: false,
        message: "Client not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: deletedClient,
      message: "Client and relative products are deleted successfully",
    });
    return;
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete client",
    });
    return;
  }
};

export const completeUpdateClient = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const clientID = req.params.id;
    if (!clientID) {
      res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
      return;
    }

    const clientData = req.body;

    if (!clientData) {
      res.status(400).json({
        success: false,
        message: "Client data is required",
      });
      return;
    }

    const newDocument = await Client.findByIdAndUpdate(clientID, clientData, {
      new: true,
      runValidators: true,
    });

    if (!newDocument) {
      res.status(404).json({
        success: false,
        message: "Client not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: newDocument,
      message: "Client updated successfully",
    });
    return;
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update client",
    });
    return;
  }
};

export const partialUpdateClient = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("Partial update client");

  try {
    const clientID = req.params.id;

    if (!clientID) {
      res.status(400).json({
        success: false,
        message: "client ID is required",
      });
      return;
    }

    const clientData = req.body;
    if (!clientData) {
      res.status(400).json({
        success: false,
        message: "Client data is required",
      });
      return;
    }

    const updatedClient = await Client.findByIdAndUpdate(clientID, clientData, {
      new: true,
      runValidators: true,
    });
    if (!updatedClient) {
      res.status(404).json({
        success: false,
        message: "Client not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: updatedClient,
      message: "Client partially updated successfully",
    });
    return;
  } catch (error) {
    console.error("Error partially updating client:", error);
    res.status(500).json({
      success: false,
      message: "Failed to partially update client",
    });
    return;
  }
};
