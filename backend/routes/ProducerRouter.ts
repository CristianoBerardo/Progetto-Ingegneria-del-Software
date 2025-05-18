import { Router } from "express";
import {
  completeUpdateProducer,
  createProducer,
  deleteProducer,
  partialUpdateProducer,
  readProducer,
  readProducers,
} from "../controllers/ProducerController";

const producerRouter = Router();

producerRouter.post("/", createProducer);
producerRouter.get("/", readProducers);


producerRouter.get("/:id", readProducer);
producerRouter.delete("/:id", deleteProducer);

producerRouter.put("/:id", completeUpdateProducer);
producerRouter.patch("/:id", partialUpdateProducer);

export default producerRouter;
