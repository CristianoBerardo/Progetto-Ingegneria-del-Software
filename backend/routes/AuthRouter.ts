import { Router } from "express";
import { loginWithFirebase } from "../controllers/AuthController";

const authRouter = Router();

authRouter.post("/login/firebase", loginWithFirebase);

export default authRouter;
