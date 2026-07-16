import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import orderSchema from '../../models/order.js';
import Razorpay from 'razorpay';

export const createRazorpayOrder = async (req, res) => {
    const { items, totalAmount } = req.body;
    const tokenUserId = req.token?.userid || req.token?.id || null;

    if (!tokenUserId || !items || !totalAmount) {
        return responseManager.badrequest({ message: 'Invalid request data for order creation.' }, res);
    }

    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const OrderModel = primary.model(constants.MODELS.order, orderSchema);

        // Fetch Razorpay credentials from .env
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            return responseManager.badrequest({ message: 'Razorpay keys not configured in environment.' }, res);
        }

        const razorpayInstance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret
        });

        // Initialize Razorpay Order
        const options = {
            amount: parseInt(totalAmount) * 100, // amount in smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_" + Date.now(),
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        // Save order to DB as Pending
        const newOrder = await OrderModel.create({
            customer: tokenUserId,
            items: items,
            totalAmount: totalAmount,
            orderStatus: 'Pending',
            paymentStatus: 'Pending',
            razorpayOrderId: razorpayOrder.id,
            createdBy: tokenUserId
        });

        return responseManager.onSuccess('Order created successfully', {
            order: newOrder,
            razorpayOrderId: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
            keyId: keyId // Send public key to frontend
        }, res);

    } catch (error) {
        console.error("Razorpay Error:", error);
        return responseManager.onError(error, res);
    }
};
