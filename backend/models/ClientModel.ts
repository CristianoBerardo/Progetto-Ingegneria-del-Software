import { Schema, model, Document } from "mongoose";

export interface IClient extends Document {
  username: string;
  email: string;
  phone: string;
  shippingAddress: string;
  // orders: Types.ObjectId[]; // Array di ID degli ordini
}

export const ClientSchema = new Schema<IClient>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  shippingAddress: { type: String },
  // orders: [{ type: Schema.Types.ObjectId, ref: "Order", required: false }],
});

export default model<IClient>("Client", ClientSchema);
