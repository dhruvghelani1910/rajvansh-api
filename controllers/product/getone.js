import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import modelSchema from '../../models/product.js';
import userModel from '../../models/user.js';
import categoryModel from '../../models/category.js';
import mongoose from 'mongoose';

export const getone = async (req, res) => {
    const { id } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return responseManager.badrequest({ message: 'Valid ID must be provided.' }, res);
    }
    
    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const Model = primary.model(constants.MODELS.product, modelSchema);
        const User = primary.model(constants.MODELS.users, userModel);
        const Category = primary.model(constants.MODELS.category, categoryModel);

        let data = await Model.findById(id).populate([
            { path: 'createdBy', model: User, select: '_id username profilepic' },
            { path: 'updatedBy', model: User, select: '_id username profilepic' },
            { path: 'deletedBy', model: User, select: '_id username profilepic' },
            { path: 'category', model: Category, select: '_id name' }
        ]).lean();

        if (data) {
            if (data.category && data.category.name) {
                data.categoryName = data.category.name;
                data.categoryId = data.category._id;
                data.category = data.category.name;
            }
            return responseManager.onSuccess('Data fetched successfully', data, res);
        } else {
            return responseManager.badrequest({ message: 'Record not found' }, res);
        }
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
