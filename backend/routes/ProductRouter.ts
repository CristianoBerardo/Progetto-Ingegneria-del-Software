import { Router } from "express";
import {
  completeUpdateProduct,
  completeUpdateProductV2,
  createProduct,
  createProductV2,
  deleteProduct,
  deleteProductV2,
  partialUpdateProduct,
  partialUpdateProductV2,
  readProduct,
  readProducts,
} from "../controllers/ProductController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const productRouter = Router();


productRouter.post("/", createProduct);
productRouter.get("/", readProducts);

productRouter.get("/:id", readProduct);
productRouter.delete("/:id", deleteProduct);

productRouter.put("/:id", completeUpdateProduct);
productRouter.patch("/:id", partialUpdateProduct);

export default productRouter;


// const productRouter = Router();

// productRouter.use((req, res, next) => {
//   const baseUrl = req.baseUrl;
//   console.log("Product Router - Base URL:", baseUrl);

//   if (baseUrl.includes("v1")) {

//     console.log("Using V1 endpoints (no auth)");
//   } else {

//     console.log("Using V2 endpoints (with auth for write operations)");
//   }

//   next();
// });

// productRouter.post("/", (req, res, next) => {
//   const baseUrl = req.baseUrl;
//   if (baseUrl.includes("v1")) {
//     createProduct(req, res);
//   } else {
//     verifyFirebaseToken(req, res, () => {
//       createProductV2(req, res);
//     });
//   }
// });

// productRouter.get("/", readProducts);

// productRouter.get("/:id", readProduct);

// productRouter.put("/:id", (req, res, next) => {
//   const baseUrl = req.baseUrl;
//   if (baseUrl.includes("v1")) {

//     completeUpdateProduct(req, res);
//   } else {

//     verifyFirebaseToken(req, res, () => {
//       completeUpdateProductV2(req, res);
//     });
//   }
// });

// productRouter.patch("/:id", (req, res, next) => {
//   const baseUrl = req.baseUrl;
//   if (baseUrl.includes("v1")) {

//     partialUpdateProduct(req, res);
//   } else {
//     verifyFirebaseToken(req, res, () => {
//       partialUpdateProductV2(req, res);
//     });
//   }
// });

// productRouter.delete("/:id", (req, res, next) => {
//   const baseUrl = req.baseUrl;
//   if (baseUrl.includes("v1")) {
//     deleteProduct(req, res);
//   } else {

//     verifyFirebaseToken(req, res, () => {
//       deleteProductV2(req, res);
//     });
//   }
// });

// export default productRouter;
