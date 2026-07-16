import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import instagramSchema from '../../models/instagram.js';
import mongoose from 'mongoose';

export const changestatus = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return responseManager.badrequest({ message: 'Invalid ID' }, res);
        }

        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const InstagramModel = primary.model(constants.MODELS.instagram, instagramSchema);

        const data = await InstagramModel.findById(id);
        if (!data) {
            return responseManager.badrequest({ message: 'Data not found' }, res);
        }

        const updatedData = await InstagramModel.findByIdAndUpdate(
            id,
            { status: !data.status, updatedBy: req.token?.userid },
            { new: true }
        );

        return responseManager.onSuccess('Status updated successfully', updatedData, res);
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
