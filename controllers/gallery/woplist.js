import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import modelSchema from '../../models/gallery.js';
import userModel from '../../models/user.js';

export const woplist = async (req, res) => {
    const { search = '' } = req.query;
    
    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const Model = primary.model(constants.MODELS.gallery, modelSchema);
        const User = primary.model(constants.MODELS.users, userModel);

        Model.find({
            status: true,
            isDeleted: false
        }).populate([
            { path: 'createdBy', model: User, select: '_id username profilepic' },
            { path: 'updatedBy', model: User, select: '_id username profilepic' }
        ]).sort({ createdAt: -1 }).lean().then((data) => {
            return responseManager.onSuccess('List fetched successfully', data, res);
        }).catch((error) => {
            return responseManager.onError(error, res);
        });
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
