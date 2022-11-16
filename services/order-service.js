import Order from '../models/order.js';
import { errorHandler } from '../middlewares/errorHandler.js';

const createOrder = async (order) => {
    const createdOrder = await Order.insert(order);
    return createdOrder;
};

const getOrderById = async (res, req) => {
    try {
        const id = req.params.id
        const order = await Order.findById({ _id: id })
        res.status(200).json({ order })
    } catch (error) {
        logger.error('error', error)
    }
}

export {
    createOrder,
    getOrderById
}