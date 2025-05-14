import { Router } from "express";
import {
  createProducer,
  deleteProducer,
  readProducers,
  readProducer,
} from "../controllers/ProducerController";

const producerRouter = Router();

producerRouter.post("/", createProducer);
producerRouter.get("/", readProducers);
producerRouter.get("/:id", readProducer);
producerRouter.delete("/:id", deleteProducer);


export default producerRouter;
