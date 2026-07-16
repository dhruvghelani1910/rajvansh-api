import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import instagramSchema from '../../models/instagram.js';
import mongoose from 'mongoose';

export const create = async (req, res) => {
    const { id, type, url, embedCode, thumbnail, status } = req.body;
    const tokenUserId = req.token?.userid || null;
    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const InstagramModel = primary.model(constants.MODELS.instagram, instagramSchema);
        
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            const updatedData = await InstagramModel.findByIdAndUpdate(
                id,
                { type, url, embedCode, thumbnail, status, updatedBy: tokenUserId },
                { new: true }
            );
            return responseManager.onSuccess('Instagram feed updated successfully', updatedData, res);
        } else {
            const newData = await InstagramModel.create({
                type, url, embedCode, thumbnail, status, createdBy: tokenUserId
            });
            return responseManager.onSuccess('Instagram feed created successfully', newData, res);
        }
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
