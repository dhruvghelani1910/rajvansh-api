import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import modelSchema from '../../models/story.js';
import mongoose from 'mongoose';
import cloudinaryUtil from '../../utilities/cloudinary.js';

export const create = async (req, res) => {
    const { id, ...data } = req.body;
    const tokenUserId = req.token?.userid || null;
    
    // Upload image to Cloudinary if file was sent directly, or use data.image uploaded via central /upload/image API
    if (req.file) data.image = await cloudinaryUtil.uploadToCloudinary(req.file.buffer, 'stories');

    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const Model = primary.model(constants.MODELS.story, modelSchema);

        if (id && mongoose.Types.ObjectId.isValid(id)) {
            const updatedData = await Model.findByIdAndUpdate(
                id,
                { ...data, updatedBy: tokenUserId },
                { new: true }
            );
            if (!updatedData) return responseManager.badrequest({ message: 'Record not found for update' }, res);
            return responseManager.onSuccess('Updated successfully', updatedData, res);
        } else {
            const createData = await Model.create({
                ...data,
                createdBy: tokenUserId
            });
            return responseManager.onSuccess('Created successfully', createData, res);
        }
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
