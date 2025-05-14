import { Router } from "express";
import {
  createProduct,
  readProducts,
  readProduct,
  deleteProduct,
} from "../controllers/ProductController";

const productRouter = Router();

productRouter.post("/", createProduct);
productRouter.get("/", readProducts);
productRouter.get("/:id", readProduct);
productRouter.delete("/:id", deleteProduct);


export default productRouter;
