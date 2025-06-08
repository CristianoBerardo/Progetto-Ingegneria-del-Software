import { Request, Response } from "express";
import Client from "../models/ClientModel";
import Order from "../models/OrderModel";
import Producer from "../models/ProducerModel";
import { OrderStatus } from "../types/OrderStatus";

export const createOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { products, totalPrice, pickupDate } = req.body;
    const test = req.body;
    console.log("Request body:", test);
    const currentUserUid = req.body.decodedToken.uid;

    if (!products || !totalPrice || !pickupDate || !currentUserUid) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    if (!Array.isArray(products) || products.length === 0) {
      res.status(400).json({ message: "Products must be a non-empty array" });
      return;
    }

    console.log("1");
    const client = await Client.findOne({ uid: currentUserUid });
    if (!client) {
      const producer = await Producer.findOne({ uid: currentUserUid });
      if (producer) {
        res.status(414).json({
          success: false,
          message: "A Producer cannot create an order",
        });
        console.log("Producer found but cannot create order");
        return;
      } else {
        res.status(413).json({
          success: false,
          message: "Client not found",
        });
        console.log("Client not found");
        return;
      }
    }
    console.log("2");

    const newOrder = new Order({
      products: products,
      clientId: client._id,
      totalPrice,
      pickupDate,
      status: OrderStatus.pending, // Default status
    });

    console.log("newOrder:", newOrder);
    console.log("3");
    // save the order and update the client's orders array
    const savedOrder = await newOrder.save();
    console.log("3.1");
    await Client.findByIdAndUpdate(client._id, {
      $push: { orders: newOrder._id },
    });
    console.log("4");
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      savedOrder,
    });
    console.log("5");
    return;
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const confirmOrder = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const { orderId } = req.body;
//     const currentUserUid = req.body.decodedToken.uid;
//     if (!orderId || !currentUserUid) {
//       res.status(400).json({ message: "Order ID and User UID are required" });
//       return;
//     }
//     const order = await Order.findById(orderId).populate("client");
//     if (!order) {
//       res.status(404).json({ message: "Order not found" });
//       return;
//     }
//     if (order.clientId !== currentUserUid) {
//       res
//         .status(403)
//         .json({ message: "You do not have permission to confirm this order" });
//       return;
//     }
//     order.status = OrderStatus.confirmed;
//     const updatedOrder = await order.save();
//     res.status(200).json({
//       success: true,
//       message: "Order confirmed successfully",
//       updatedOrder,
//     });
//   } catch (error) {
//     console.error("Error confirming order:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const deleteOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const currentUserUid = req.body.decodedToken.uid;

    if (!orderId || !currentUserUid) {
      res.status(400).json({ message: "Order ID and User UID are required" });
      return;
    }
    const order = await Order.findById(orderId).populate({
      path: "clientId",
      select: "_id",
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    console.log("Order found:", order);

    const updateClientOrders = await Client.findOneAndUpdate(
      { _id: order.clientId._id },
      { $pull: { orders: orderId } },
      { new: true },
    );

    const deleteOrder = await Order.findByIdAndDelete(orderId);

    if (!updateClientOrders || !deleteOrder) {
      res.status(404).json({
        message: "An error occurred while processing the deletion order.",
      });
      return;
    }
    console.log("Order deleted successfully:", deleteOrder);
    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const readOrders = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const currentUserUid = req.body.decodedToken.uid;
    console.log("Current User UID:", currentUserUid);

    if (!currentUserUid) {
      res.status(400).json({ message: "User UID is required" });
      return;
    }

    console.log("UID:", currentUserUid);

    const order = await Client.find({ uid: currentUserUid })
      .select("_id orders")
      .populate({
        path: "orders",
        select: "_id totalPrice status pickupDate",
      });

    const orders: any = [];

    for (const element of order) {
      element.orders.forEach((order: any) => {
        orders.push({
          _id: order._id.toString(),
          totalPrice: order.totalPrice,
          status: order.status ? order.status : "pending",
          pickupDate: order.pickupDate,
        });
      });
    }

    console.log("Orders:", orders);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
