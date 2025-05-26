import { Router } from "express";
import { loginController } from "../controllers/AuthController2";
import {
  registerClient,
  registerProducer,
  loginWithFirebase,
} from "../controllers/AuthController";

const authRouter = Router();

authRouter.post("/register/client/:idToken", registerClient);
authRouter.post("/register/producer/:idToken", registerProducer);
// authRouter.post("/login/:idToken", loginWithFirebase);
authRouter.post("/login/:idToken", loginController);

export default authRouter;
