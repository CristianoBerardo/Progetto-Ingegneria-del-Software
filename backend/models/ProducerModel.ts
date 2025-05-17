import { Schema, model, Document, Types } from 'mongoose';
import { IProduct } from './ProductModel';

export interface IProducer extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  products: Types.ObjectId[]; // Array of product IDs
}

export const ProducerSchema = new Schema<IProducer>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product", required: false}],
});

export default model<IProducer>('Producer', ProducerSchema);
