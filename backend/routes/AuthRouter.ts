import { Router } from "express";
import { registerClient, registerProducer, loginWithFirebase } from "../controllers/AuthController";

const authRouter = Router();

authRouter.post("/register/client/:idToken", registerClient);
authRouter.post("/register/producer/:idToken", registerProducer);
authRouter.post("/login/:idToken", loginWithFirebase);

export default authRouter;