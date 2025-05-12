import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  available: boolean;
}

export const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  available: { type: Boolean, default: true },
});

export default model<IProduct>('Product', ProductSchema);
