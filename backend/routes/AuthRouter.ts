import { Router } from "express";
import { registerWithFirebase, loginWithFirebase } from "../controllers/AuthController";

const authRouter = Router();

authRouter.post("/register/:idToken", registerWithFirebase);
authRouter.post("/login/:idToken", loginWithFirebase);

export default authRouter;
