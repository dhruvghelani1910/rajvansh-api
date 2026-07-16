import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import customerSchema from '../../models/customer.js';
import mongoose from 'mongoose';

export const update = async (req, res) => {
    const data = req.body;
    const tokenUserId = req.token?.userid || req.token?.id || null;

    if (!tokenUserId || !mongoose.Types.ObjectId.isValid(tokenUserId)) {
        return responseManager.badrequest({ message: 'Valid token required to update profile.' }, res);
    }

    // Do not allow updating sensitive fields directly through this
    delete data.password;
    delete data.role;
    delete data.username; // Usually we don't allow username changes, but if we do, check unique.

    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const CustomerModel = primary.model(constants.MODELS.customer, customerSchema);

        const updatedUser = await CustomerModel.findByIdAndUpdate(
            tokenUserId,
            { ...data, updatedBy: tokenUserId },
            { new: true }
        ).lean();

        if (!updatedUser) {
            return responseManager.badrequest({ message: 'User not found' }, res);
        }

        return responseManager.onSuccess('Profile updated successfully', {
            username: updatedUser.username,
            surname: updatedUser.surname,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            profilepic: updatedUser.profilepic,
            role: updatedUser.role,
            cart: updatedUser.cart || [],
            wishlist: updatedUser.wishlist || []
        }, res);
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
