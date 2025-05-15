import { Schema, model, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  available: number;
  producer: Types.ObjectId; // This should be a reference to the Producer model
}

export const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  available: { type: Number, required: true },
  producer: { type: Schema.Types.ObjectId, ref: 'Producer', required: true }
});

export default model<IProduct>('Product', ProductSchema);
