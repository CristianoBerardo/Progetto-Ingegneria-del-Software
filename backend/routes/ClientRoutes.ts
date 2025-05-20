import { Router } from "express";
import {
  completeUpdateClient,
  createClient,
  deleteClient,
  partialUpdateClient,
  readClient,
  readClients,
} from "../controllers/ClientController";

const clientRouter = Router();

clientRouter.post("/", createClient);
clientRouter.get("/", readClients);

clientRouter.get("/:id", readClient);
clientRouter.delete("/:id", deleteClient);

clientRouter.put("/:id", completeUpdateClient);
clientRouter.patch("/:id", partialUpdateClient);

export default clientRouter;
