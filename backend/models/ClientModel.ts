import { Document, Schema, model } from "mongoose";

export interface IClient extends Document {
  uid: string; // Firebase UID
  username: string;
  email: string;
  phone: string;
  shippingAddress: string;
  roles: string;
  // orders: Types.ObjectId[]; // Array di ID degli ordini
}

export const ClientSchema = new Schema<IClient>({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  shippingAddress: { type: String },
  roles: {
    type: String,
    required: true,
    default: "client",
  },
  // orders: [{ type: Schema.Types.ObjectId, ref: "Order", required: false }],
});

export default model<IClient>("Client", ClientSchema);
