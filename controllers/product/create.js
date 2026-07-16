import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import modelSchema from '../../models/product.js';
import mongoose from 'mongoose';
import cloudinaryUtil from '../../utilities/cloudinary.js';

export const create = async (req, res) => {
    const { id, ...data } = req.body;
    const tokenUserId = req.token?.userid || null;
    
    // Handle file uploads via Cloudinary
    if (req.files) {
        if (req.files.main_image) {
            data.main_image = await cloudinaryUtil.uploadToCloudinary(req.files.main_image[0].buffer, 'products');
        }
        if (req.files.productimage) {
            data.productimage = await Promise.all(req.files.productimage.map(f => cloudinaryUtil.uploadToCloudinary(f.buffer, 'products')));
        }
    } else if (req.file) {
        data.main_image = await cloudinaryUtil.uploadToCloudinary(req.file.buffer, 'products');
    }

    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const Model = primary.model(constants.MODELS.product, modelSchema);

        if (data.code) {
            const query = { code: data.code };
            if (id && mongoose.Types.ObjectId.isValid(id)) {
                query._id = { $ne: id };
            }
            const existing = await Model.findOne(query);
            if (existing) {
                return responseManager.badrequest({ message: `Product code '${data.code}' already exists` }, res);
            }
        }

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
