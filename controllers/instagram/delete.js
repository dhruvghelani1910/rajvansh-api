import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import instagramSchema from '../../models/instagram.js';
import mongoose from 'mongoose';

export const remove = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return responseManager.badrequest({ message: 'Invalid ID' }, res);
        }
        
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const InstagramModel = primary.model(constants.MODELS.instagram, instagramSchema);

        await InstagramModel.findByIdAndUpdate(id, { isDeleted: true, updatedBy: req.token?.userid });
        return responseManager.onSuccess('Instagram feed deleted successfully', 1, res);
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
