import { Router } from "express";
import { loginWithFirebase } from "../controllers/AuthController";

const authRouter = Router();

authRouter.post("/:idToken", loginWithFirebase);

export default authRouter;
