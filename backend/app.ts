import cors from "cors";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import { startServer } from "./connections/mongoDB/connections";
import producerRouter from "./routes/ProducerRouter";
import productRouter from "./routes/ProductRouter";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/api/producers", producerRouter);

app.use("/api/products", productRouter);

app.get("/api", (req, res) => {
  res.send(JSON.stringify(expressListEndpoints(app), null, 2));
});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await startServer();
});
