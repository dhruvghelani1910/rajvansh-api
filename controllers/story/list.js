import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import modelSchema from '../../models/story.js';
import userModel from '../../models/user.js';

export const list = async (req, res) => {
    const { page = 1, limit = 10, search = '', sortfield = 'order', sortoption = 1, status, isDeleted = false } = req.body;
    
    let query = { isDeleted };
    if (typeof status === 'boolean') query.status = status;
    
    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const Model = primary.model(constants.MODELS.story, modelSchema);
        const User = primary.model(constants.MODELS.users, userModel);

        Model.paginate(query, {
            page,
            limit: parseInt(limit),
            populate: [
                { path: 'createdBy', model: User, select: '_id username profilepic' },
                { path: 'updatedBy', model: User, select: '_id username profilepic' }
            ],
            sort: { [sortfield]: sortoption },
            lean: true
        }).then((data) => {
            return responseManager.onSuccess('List fetched successfully', data, res);
        }).catch((error) => {
            return responseManager.onError(error, res);
        });
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
