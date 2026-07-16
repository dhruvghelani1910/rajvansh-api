import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import modelSchema from '../../models/order.js';
import mongoose from 'mongoose';

export const remove = async (req, res) => {
    const { id } = req.body;
    const tokenUserId = req.token?.userid || null;

    if (!id || (Array.isArray(id) && id.length === 0)) {
        return responseManager.badrequest({ message: 'ID must be provided.' }, res);
    }

    const ids = Array.isArray(id) ? id : [id];
    for (const i of ids) {
        if (!mongoose.Types.ObjectId.isValid(i)) return responseManager.badrequest({ message: 'Invalid ID format.' }, res);
    }

    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const Model = primary.model(constants.MODELS.order, modelSchema);
        const result = await Model.updateMany(
            { _id: { $in: ids } },
            [{ $set: { isDeleted: { $eq: [false, "$isDeleted"] }, deletedBy: tokenUserId } }]
        );

        if (result.matchedCount > 0) {
            return responseManager.onSuccess('Deleted successfully', 1, res);
        } else {
            return responseManager.badrequest({ message: 'Record not found' }, res);
        }
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
