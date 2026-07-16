import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import modelSchema from '../../models/banner.js';
import userModel from '../../models/user.js';
import mongoose from 'mongoose';

export const getone = async (req, res) => {
    const { id } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return responseManager.badrequest({ message: 'Valid ID must be provided.' }, res);
    }
    
    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const Model = primary.model(constants.MODELS.banner, modelSchema);
        const User = primary.model(constants.MODELS.users, userModel);

        let data = await Model.findById(id).populate([
            { path: 'createdBy', model: User, select: '_id username profilepic' },
            { path: 'updatedBy', model: User, select: '_id username profilepic' },
            { path: 'deletedBy', model: User, select: '_id username profilepic' },
        ]).lean();

        if (data) {
            return responseManager.onSuccess('Data fetched successfully', data, res);
        } else {
            return responseManager.badrequest({ message: 'Record not found' }, res);
        }
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
