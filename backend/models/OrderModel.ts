import { Document, Schema, Types, model } from "mongoose";
import { OrderStatus } from "../types/OrderStatus";

export interface IOrder extends Document {
    products: Types.ObjectId[];
    client: Types.ObjectId;
    totalPrice: number;
    pickupDate: Date;
    orderDate: Date;
    status: OrderStatus;
}

export const OrderSchema = new Schema<IOrder>({
    client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }],
    totalPrice: { type: Number, required: true },
    pickupDate: { type: Date, required: true },
    orderDate: { type: Date, default: Date.now },
});

export default model<IOrder>("Order", OrderSchema);
