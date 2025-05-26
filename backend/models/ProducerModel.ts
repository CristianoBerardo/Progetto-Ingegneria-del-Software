import { Schema, model, Document, Types } from "mongoose";

export interface IProducer extends Document {
  uid: string; // firebase UID
  name: string;
  email: string;
  phone: string;
  address: string;
  products: Types.ObjectId[]; // Array of product IDs
  roles: {
    type: string;
    required: false;
    enum: ['client', 'producer', 'admin'];
    default : 'producer';
  };
}

export const ProducerSchema = new Schema<IProducer>({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product", required: false }],
  roles: {
    type: String,
    required: false,
    enum: ["client", "producer", "admin"],
    default: "producer",
  },
});

export default model<IProducer>("Producer", ProducerSchema);
