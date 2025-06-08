import { Router } from "express";
import {
  createOrder,
  readOrders,
  deleteOrder,
} from "../controllers/OrderController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const orderRouter = Router();

orderRouter.post("/", verifyFirebaseToken, createOrder);
orderRouter.get("/", verifyFirebaseToken, readOrders);

orderRouter.delete("/:orderId", verifyFirebaseToken, deleteOrder);

// orderRouter.post("/confirm", verifyFirebaseToken, confirmOrder);
// orderRouter.post("/cancel", verifyFirebaseToken, deleteOrder);

export default orderRouter;