import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import orderSchema from '../../models/order.js';
import crypto from 'crypto';

export const verifyPayment = async (req, res) => {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return responseManager.badrequest({ message: 'Missing payment verification details.' }, res);
    }

    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const OrderModel = primary.model(constants.MODELS.order, orderSchema);

        const secret = process.env.RAZORPAY_KEY_SECRET;

        if (!secret) {
            return responseManager.badrequest({ message: 'Razorpay secret key not configured in environment.' }, res);
        }

        // Validate Signature
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            await OrderModel.findByIdAndUpdate(orderId, { paymentStatus: 'Failed' });
            return responseManager.badrequest({ message: 'Payment verification failed. Invalid signature.' }, res);
        }

        // Signature is valid, update order status
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            {
                paymentStatus: 'Paid',
                orderStatus: 'Processing',
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature
            },
            { new: true }
        );

        return responseManager.onSuccess('Payment verified successfully', updatedOrder, res);

    } catch (error) {
        console.error("Payment Verification Error:", error);
        return responseManager.onError(error, res);
    }
};
