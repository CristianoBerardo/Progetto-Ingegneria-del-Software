import { Router } from "express";
import {
  createOrder,
  confirmOrder,
  readOrders,
  cancelOrder,
} from "../controllers/OrderController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const orderRouter = Router();

orderRouter.post("/", verifyFirebaseToken, createOrder);
orderRouter.post("/confirm", verifyFirebaseToken, confirmOrder);
orderRouter.post("/cancel", verifyFirebaseToken, cancelOrder);
orderRouter.get("/", verifyFirebaseToken, readOrders);

export default orderRouter;