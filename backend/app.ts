import express from 'express';
import mongoose from 'mongoose';
import { databaseProducts } from './connections/mongoDB/connections';
import productRoutes from './routes/product.routes';

async function run() {
  try {
    await mongoose.connect(databaseProducts);
      console.log("Pinged your deployment. You successfully connected to MongjdhfbhoDB!");
      const Model = mongoose.model('Pippo', new mongoose.Schema({ name: String }));
      await Model.createCollection();
  } finally {
    await mongoose.disconnect();
  }

}
run().catch(console.dir);

const app = express();
app.use(express.json());

app.use('/api/products', productRoutes);

export default app;
