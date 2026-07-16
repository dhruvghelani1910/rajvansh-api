import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import orderSchema from '../../models/order.js';
import productSchema from '../../models/product.js';
import mongoose from 'mongoose';
import whatsapp from '../../utilities/whatsapp.js';

export const create = async (req, res) => {
    const { id, items, customer, totalAmount, ...data } = req.body;
    const tokenUserId = req.token?.userid || null;

    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const OrderModel = primary.model(constants.MODELS.order, orderSchema);
        const ProductModel = primary.model(constants.MODELS.product, productSchema);

        if (id && mongoose.Types.ObjectId.isValid(id)) {
            // Update order (we usually don't restore inventory here unless cancelled, 
            // but for simplicity we just update standard fields)
            const updatedData = await OrderModel.findByIdAndUpdate(
                id,
                { ...data, updatedBy: tokenUserId },
                { new: true }
            );
            if (!updatedData) return responseManager.badrequest({ message: 'Order not found for update' }, res);
            
            // Trigger WhatsApp status update
            if (data.orderStatus) {
                whatsapp.sendOrderStatusUpdate(updatedData);
                
                // If Approved, also send invoice
                if (data.orderStatus.toLowerCase() === 'approved') {
                    // Populate customer to get phone number
                    const populatedOrder = await OrderModel.findById(id).populate('customer').lean();
                    if (populatedOrder && populatedOrder.customer) {
                        whatsapp.sendInvoiceNotification(populatedOrder, populatedOrder.customer);
                    }
                }
            }

            return responseManager.onSuccess('Order updated successfully', updatedData, res);
        } else {
            // Create New Order & Deduct Inventory
            if (!items || !Array.isArray(items) || items.length === 0) {
                return responseManager.badrequest({ message: 'Order must contain items.' }, res);
            }

            // Deduct inventory
            for (let item of items) {
                const product = await ProductModel.findById(item.productid);
                if (!product) {
                    return responseManager.badrequest({ message: `Product ${item.productid} not found.` }, res);
                }
                if (product.quantity < item.quantity) {
                    return responseManager.badrequest({ message: `Not enough stock for ${product.productname}. Available: ${product.quantity}` }, res);
                }
                
                product.quantity -= item.quantity;
                await product.save();
            }

            const createData = await OrderModel.create({
                ...data,
                customer: customer || tokenUserId,
                items,
                totalAmount,
                createdBy: tokenUserId
            });
            
            // Trigger WhatsApp stub
            whatsapp.sendOrderNotification(createData);
            
            return responseManager.onSuccess('Order created successfully', createData, res);
        }
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
