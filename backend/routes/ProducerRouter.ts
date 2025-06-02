import { Router } from "express";
import {
  completeUpdateProducer,
  createProducer,
  deleteProducer,
  getProducerNames,
  getProductsByProducerId,
  partialUpdateProducer,
  readProducer,
  readProducers,
} from "../controllers/ProducerController";

const producerRouter = Router();


producerRouter.post("/", createProducer);
producerRouter.get("/", readProducers);

producerRouter.get("/names", getProducerNames);

producerRouter.get("/:id/products", getProductsByProducerId);
producerRouter.get("/:id", readProducer);
producerRouter.put("/:id", completeUpdateProducer);
producerRouter.patch("/:id", partialUpdateProducer);
producerRouter.delete("/:id", deleteProducer);

export default producerRouter;