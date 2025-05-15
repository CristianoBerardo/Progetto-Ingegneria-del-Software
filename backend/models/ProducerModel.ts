import { Schema, model, Document } from 'mongoose';
// import { IProduct } from './ProductModel';

export interface IProducer extends Document {
  name: string;
  email: string;
  // phone: string;
  // authenticated: boolean;
  // address: string;
  // inventory: IProduct[];
}

export const ProducerSchema = new Schema<IProducer>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  // phone: { type: String, required: true },
  // authenticated: { type: Boolean, default: false },
  // address: { type: String, required: true },
  // inventory: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

export default model<IProducer>('Producer', ProducerSchema);
