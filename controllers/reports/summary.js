import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import orderSchema from '../../models/order.js';
import userSchema from '../../models/user.js';
import productSchema from '../../models/product.js';
import customerSchema from '../../models/customer.js';

export const summary = async (req, res) => {
    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const OrderModel = primary.model(constants.MODELS.order, orderSchema);
        const UserModel = primary.model(constants.MODELS.users, userSchema);
        const ProductModel = primary.model(constants.MODELS.product, productSchema);
        const CustomerModel = primary.model(constants.MODELS.customer, customerSchema);

        // 1. Total Orders & Revenue
        const orders = await OrderModel.find({ isDeleted: false });
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        // Revenue by status
        const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
        const processingOrders = orders.filter(o => o.orderStatus === 'Processing').length;
        const completedOrders = orders.filter(o => o.orderStatus === 'Completed').length;
        const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled').length;

        // 2. Customers Count
        const totalCustomers = await CustomerModel.countDocuments({ isDeleted: false });

        // 3. Inventory Status
        const products = await ProductModel.find({ isDeleted: false });
        const lowStockItems = products.filter(p => p.quantity < 5).map(p => ({
            id: p._id,
            name: p.productname,
            quantity: p.quantity,
            price: p.price
        }));

        const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

        return responseManager.onSuccess('Reports summary fetched', {
            totalOrders,
            totalRevenue,
            orderStats: {
                pending: pendingOrders,
                processing: processingOrders,
                completed: completedOrders,
                cancelled: cancelledOrders
            },
            totalCustomers,
            lowStockItems,
            totalInventoryValue
        }, res);
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
