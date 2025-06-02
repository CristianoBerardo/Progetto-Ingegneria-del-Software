import { Request, Response } from 'express';
import Client from '../models/ClientModel';
import Order from '../models/OrderModel';
import { OrderStatus } from '../types/OrderStatus';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { products, totalPrice, pickupDate } = req.body;
        const currentUserUid = req.body.decodedToken.uid;
        
        if (!products || !totalPrice || !pickupDate || !currentUserUid) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const client = await Client.findOne({ uid: currentUserUid });
        if (!client) {
            res.status(404).json({
              success: false,
              message: "Client not found",
            });
            return;
        }

        const newOrder = new Order({
            products: products.map((productId: string) => ({ product: productId })),
            client: client._id,
            totalPrice,
            pickupDate,
            status: 'pending', // Default status
        });

        // save the order and update the client's orders array
        const savedOrder = await newOrder.save();
        await Client.findByIdAndUpdate(client._id, {
            $push: { orders: newOrder._id }
        });       
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            savedOrder
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const confirmOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.body;
        const currentUserUid = req.body.decodedToken.uid;
        if (!orderId || !currentUserUid) {
            res.status(400).json({ message: 'Order ID and User UID are required' });
            return;
        }
        const order = await Order.findById(orderId).populate('client');
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        if (order.client !== currentUserUid) {
            res.status(403).json({ message: 'You do not have permission to confirm this order' });
            return;
        }
        order.status = OrderStatus.confirmed; 
        const updatedOrder = await order.save();
        res.status(200).json({
            success: true,
            message: 'Order confirmed successfully',
            updatedOrder
        });
    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.body;
        const currentUserUid = req.body.decodedToken.uid;
        if (!orderId || !currentUserUid) {
            res.status(400).json({ message: 'Order ID and User UID are required' });
            return;
        }
        const order = await Order.findById(orderId).populate('client');
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        if (order.client !== currentUserUid) {
            res.status(403).json({ message: 'You do not have permission to cancel this order' });
            return;
        }
        order.status = OrderStatus.cancelled;
        const updatedOrder = await order.save();
        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            updatedOrder
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const readOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const currentUserUid = req.body.decodedToken.uid; 
        
        if (!currentUserUid) {
            res.status(400).json({ message: 'User UID is required' });
            return;
        }

        const client = await Client.findOne({ uid: currentUserUid }).populate('orders');
        if (!client) {
            res.status(404).json({ message: 'Client not found' });
            return;
        }

        res.status(200).json({
            success: true,
            orders: client.orders
        });
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}