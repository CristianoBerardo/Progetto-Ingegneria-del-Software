import cors from "cors";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import { startServer } from "./connections/mongoDB/connections";
import administratorRouter from "./routes/AdministratorRouter";
import authRouter from "./routes/AuthRouter";
import clientRouter from "./routes/ClientRoutes";
import producerRouter from "./routes/ProducerRouter";
import productRouter from "./routes/ProductRouter";
import productRouterWithAuth from "./routes/ProductRouterWithAuth";
import orderRouter from "./routes/OrderRoutes";

// import { deleteAllUsers } from "./config/firebase";
// import { setAdminClaims } from "./controllers/auth/AdminClaims";

const app = express();
const port = process.env.PORT || 3000;

// Clear all Firebase users before starting the server
// deleteAllUsers();
// setAdminClaims("admin@admin.it")

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Dev environment
      "https://agritrento-rhzf.onrender.com", // Production frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/v1/admin", administratorRouter);
app.use("/api/v1/producers", producerRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/clients", clientRouter);

app.use("/api/v2/products", productRouterWithAuth);

app.use("/auth", authRouter);

app.use("/api/v1/orders", orderRouter);

app.get("/api", (req, res) => {
  res.send(JSON.stringify(expressListEndpoints(app), null, 2));
});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await startServer();
});

export default app;
