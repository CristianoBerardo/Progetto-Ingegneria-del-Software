import { Document, Schema, Types, model } from "mongoose";
import { OrderStatus } from "../types/OrderStatus";

interface OrderItem{
    productId: Types.ObjectId;
    quantity: number;
}

export interface IOrder extends Document {
    products: OrderItem[];
    clientId: Types.ObjectId;
    totalPrice: number;
    pickupDate: Date;
    orderDate: Date;
    status: OrderStatus;
}

export const OrderSchema = new Schema<IOrder>({
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    products: [{
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true}
    }],
    totalPrice: { type: Number, required: true },
    pickupDate: { type: Date, required: true },
    orderDate: { type: Date, default: Date.now },
});

export default model<IOrder>("Order", OrderSchema);
