import { Router } from "express";
import {
  completeUpdateProduct,
  createProduct,
  deleteProduct,
  partialUpdateProduct,
  readProduct,
  readProducts,
  searchProducts,
} from "../controllers/ProductController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const productRouter = Router();

productRouter.get("/", readProducts);
productRouter.get("/:id", readProduct);
productRouter.post("/", verifyFirebaseToken, createProduct);
productRouter.put("/:id", verifyFirebaseToken, completeUpdateProduct);
productRouter.patch("/:id", verifyFirebaseToken, partialUpdateProduct);
productRouter.delete("/:id", verifyFirebaseToken, deleteProduct);

export default productRouter;
