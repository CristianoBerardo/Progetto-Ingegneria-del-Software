import { Router } from "express";
import {
  completeUpdateProductV2,
  createProductV2,
  deleteProductV2,
  partialUpdateProductV2,
  readProduct,
  readProducts,
} from "../controllers/ProductController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const productRouterWithAuth = Router();

productRouterWithAuth.post("/", verifyFirebaseToken, createProductV2);
// productRouterWithAuth.get("/", readProducts);

// productRouterWithAuth.get("/:id", readProduct);
productRouterWithAuth.put("/:id", verifyFirebaseToken, completeUpdateProductV2);
productRouterWithAuth.patch("/:id", verifyFirebaseToken, partialUpdateProductV2);
productRouterWithAuth.delete("/:id", verifyFirebaseToken, deleteProductV2);

export default productRouterWithAuth;
