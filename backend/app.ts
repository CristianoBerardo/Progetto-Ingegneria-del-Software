import express from 'express';
import mongoose from 'mongoose';
import { databaseProducts } from './connections/mongoDB/connections';
import productRoutes from './routes/ProductEndPoint';

async function run() {
  try {
    // await mongoose.connect(databaseProducts);
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      // const Model = mongoose.model('Pippo', new mongoose.Schema({ name: String }));
      // await Model.createCollection();
  } finally {
    // await mongoose.disconnect();
  }

}
run().catch(console.dir);

const app = express();
app.use(express.json());

// Use the product routes
app.use('/api/products', productRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;
