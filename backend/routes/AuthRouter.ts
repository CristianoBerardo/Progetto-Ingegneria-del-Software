import { Router } from "express";
import { loginController } from "../controllers/auth/LoginController";
import { registerClientController } from "../controllers/auth/RegisterClientController";
import { registerProducerController } from "../controllers/auth/registerProducerController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const authRouter = Router();

authRouter.use(verifyFirebaseToken);

authRouter.post("/clients/", registerClientController);
authRouter.post("/producers/", registerProducerController);

authRouter.post("/login/", loginController);

export default authRouter;
