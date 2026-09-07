import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import orderSchema from '../../models/order.js';
import productSchema from '../../models/product.js';
import customerSchema from '../../models/customer.js';
import { saveExcelToCloud } from '../../utilities/cloudinary.js';
import ExcelJS from 'exceljs';
import moment from 'moment';

export const exportReport = async (req, res) => {
    try {
        const { fromDate, toDate, customerId, productCode } = req.query;

        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const OrderModel = primary.model(constants.MODELS.order, orderSchema);
        const ProductModel = primary.model(constants.MODELS.product, productSchema);
        const CustomerModel = primary.model(constants.MODELS.customer, customerSchema);

        // Date Filters
        const orderFilter = { isDeleted: false };
        let dateLabel = "All Time";
        if (fromDate && toDate) {
            const start = moment(fromDate, 'YYYY-MM-DD').startOf('day').toDate();
            const end = moment(toDate, 'YYYY-MM-DD').endOf('day').toDate();
            orderFilter.createdAt = { $gte: start, $lte: end };
            dateLabel = `${moment(start).format('DD MMM YYYY')} to ${moment(end).format('DD MMM YYYY')}`;
        }

        // Customer Filter
        if (customerId) {
            orderFilter.customer = customerId;
        }

        // Fetch Orders
        const orders = await OrderModel.find(orderFilter).populate('customer').lean();

        // Calculations for Summary
        const totalOrders = orders.length;
        const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        // Build Excel Workbook
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Rajvansh Admin';
        workbook.created = new Date();

        // ---------------- SHEET 1: SUMMARY ----------------
        const summarySheet = workbook.addWorksheet('Summary');
        summarySheet.columns = [
            { header: 'Metric', key: 'metric', width: 30 },
            { header: 'Value', key: 'value', width: 30 }
        ];
        summarySheet.getRow(1).font = { bold: true };
        summarySheet.addRow({ metric: 'Date Range', value: dateLabel });
        summarySheet.addRow({ metric: 'Total Orders', value: totalOrders });
        summarySheet.addRow({ metric: 'Total Revenue (₹)', value: totalSales });
        
        if (customerId && orders.length > 0) {
            const custName = orders[0].customer?.fullname || customerId;
            summarySheet.addRow({ metric: 'Filtered Customer', value: custName });
        }
        if (productCode) {
            summarySheet.addRow({ metric: 'Filtered Product Code', value: productCode });
        }

        // ---------------- SHEET 2: ORDERS ----------------
        const orderSheet = workbook.addWorksheet('Orders');
        orderSheet.columns = [
            { header: 'Order ID', key: 'orderId', width: 25 },
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Customer', key: 'customer', width: 25 },
            { header: 'Amount (₹)', key: 'amount', width: 15 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Payment', key: 'payment', width: 15 }
        ];
        orderSheet.getRow(1).font = { bold: true };

        orders.forEach(o => {
            orderSheet.addRow({
                orderId: o._id.toString(),
                date: moment(o.createdAt).format('DD MMM YYYY HH:mm'),
                customer: o.customer ? o.customer.fullname : 'N/A',
                amount: o.totalAmount,
                status: o.orderStatus,
                payment: o.paymentStatus
            });
        });

        // ---------------- SHEET 3: INVENTORY ----------------
        const inventorySheet = workbook.addWorksheet('Inventory');
        inventorySheet.columns = [
            { header: 'Product Code', key: 'code', width: 15 },
            { header: 'Product Name', key: 'name', width: 30 },
            { header: 'Sold (In Range)', key: 'sold', width: 20 },
            { header: 'Remaining Stock', key: 'stock', width: 20 },
            { header: 'Price (₹)', key: 'price', width: 15 }
        ];
        inventorySheet.getRow(1).font = { bold: true };

        // Calculate quantities sold per product within the date range
        const productSales = {};
        orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const pId = item.productid.toString();
                    if (!productSales[pId]) productSales[pId] = 0;
                    productSales[pId] += (item.quantity || 1);
                });
            }
        });

        // Fetch products
        const productFilter = { isDeleted: false };
        if (productCode) {
            productFilter.code = { $regex: new RegExp(productCode, 'i') };
        }
        const products = await ProductModel.find(productFilter).lean();

        products.forEach(p => {
            const pId = p._id.toString();
            const soldQty = productSales[pId] || 0;
            inventorySheet.addRow({
                code: p.code || 'N/A',
                name: p.productname,
                sold: soldQty,
                stock: p.quantity,
                price: p.price
            });
        });

        // Generate Buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Upload to Cloudinary
        const fileName = `Report_${moment().format('YYYYMMDD_HHmmss')}.xlsx`;
        const cloudinaryUrl = await saveExcelToCloud(buffer, 'rajvansh', 'reports', fileName);

        return responseManager.onSuccess('Report generated successfully', { url: cloudinaryUrl }, res);
    } catch (error) {
        console.error("exportReport error:", error);
        return responseManager.onError(error, res);
    }
};
