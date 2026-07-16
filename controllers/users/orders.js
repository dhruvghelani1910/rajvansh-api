import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import inquirySchema from '../../models/inquiry.js';
import mongoose from 'mongoose';

export const orders = async (req, res) => {
    const tokenUserId = req.token?.userid || req.token?.id || null;

    if (!tokenUserId || !mongoose.Types.ObjectId.isValid(tokenUserId)) {
        return responseManager.badrequest({ message: 'Valid token required to fetch orders.' }, res);
    }

    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const InquiryModel = primary.model(constants.MODELS.inquiry, inquirySchema);

        const userOrders = await InquiryModel.find({ createdBy: tokenUserId }).sort({ createdAt: -1 }).lean();

        return responseManager.onSuccess('Orders fetched successfully', userOrders, res);
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
