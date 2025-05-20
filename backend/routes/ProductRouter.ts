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

const productRouter = Router();

productRouter.post("/", createProduct);
productRouter.get("/", readProducts);


productRouter.get("/:id", readProduct);
productRouter.delete("/:id", deleteProduct);

productRouter.put("/:id", completeUpdateProduct);
productRouter.patch("/:id", partialUpdateProduct);

export default productRouter;
