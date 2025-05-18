import { Router } from "express";
import { loginWithFirebase } from "../controllers/AuthController";

const authRouter = Router();

authRouter.post("/:idtoken", loginWithFirebase);

export default authRouter;
