import { Router } from "express";
import {
  readAdministrator,
  createAdministrator,
} from "../controllers/AdministratorController";

const administratorRouter = Router();

administratorRouter.post("/", createAdministrator);
administratorRouter.get("/:id", readAdministrator);

export default administratorRouter;
