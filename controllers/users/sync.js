import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import customerSchema from '../../models/customer.js';
import mongoose from 'mongoose';

export const sync = async (req, res) => {
    const { cart, wishlist } = req.body;
    const tokenUserId = req.token?.userid || req.token?.id || null;

    if (!tokenUserId || !mongoose.Types.ObjectId.isValid(tokenUserId)) {
        return responseManager.badrequest({ message: 'Valid token required for syncing.' }, res);
    }

    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const CustomerModel = primary.model(constants.MODELS.customer, customerSchema);

        const updateData = {};
        if (cart !== undefined) updateData.cart = cart;
        if (wishlist !== undefined) updateData.wishlist = wishlist;

        const updatedUser = await CustomerModel.findByIdAndUpdate(
            tokenUserId,
            { ...updateData, updatedBy: tokenUserId },
            { new: true, strict: false }
        ).lean();

        if (!updatedUser) {
            return responseManager.badrequest({ message: 'User not found' }, res);
        }

        return responseManager.onSuccess('Synced successfully', {}, res);
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
