import cors from "cors";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import { startServer } from "./connections/mongoDB/connections";
import authRouter from "./routes/AuthRouter";
import producerRouter from "./routes/ProducerRouter";
import productRouter from "./routes/ProductRouter";
import productRouterWithAuth from "./routes/ProductRouterWithAuth";
import clientRouter from "./routes/ClientRoutes";
import { deleteAllUsers } from "./config/firebase";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/v1/producers", producerRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/clients", clientRouter);


// app.use("/api/v2/producers", producerRouter);
// app.use("/api/v2/products", productRouter);

app.use("/api/v2/products", productRouterWithAuth);

app.use("/auth", authRouter);

app.get("/api", (req, res) => {
  res.send(JSON.stringify(expressListEndpoints(app), null, 2));
});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log("Available routes:");
  console.log("V1 (no auth): /api/v1/products, /api/v1/producers, /api/v1/clients");
  console.log("V2 (with auth): /api/v2/products, /api/v2/producers, /api/v2/clients");
  console.log("Auth: /auth");
  await startServer();
});

export default app;