import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import modelSchema from '../../models/inquiry.js';
import mongoose from 'mongoose';
import whatsapp from '../../utilities/whatsapp.js';

export const create = async (req, res) => {
    const { id, ...data } = req.body;
    const tokenUserId = req.token?.userid || null;
    
    // Add file if uploaded (single upload logic fallback)
    if (req.file) data.image = req.file.path; // Or upload to cloudinary directly

    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const Model = primary.model(constants.MODELS.inquiry, modelSchema);

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
            // Trigger WhatsApp stub
            whatsapp.sendInquiryNotification(createData);
            return responseManager.onSuccess('Created successfully', createData, res);
        }
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
