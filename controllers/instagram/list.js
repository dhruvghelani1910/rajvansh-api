import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import instagramSchema from '../../models/instagram.js';

export const list = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.body;
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const InstagramModel = primary.model(constants.MODELS.instagram, instagramSchema);

        const query = { isDeleted: false };
        if (search) {
            query.$or = [
                { url: { $regex: search, $options: 'i' } },
                { type: { $regex: search, $options: 'i' } }
            ];
        }

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { createdAt: -1 }
        };

        const result = await InstagramModel.paginate(query, options);
        return responseManager.onSuccess('Instagram feeds fetched successfully', result, res);
    } catch (error) {
        return responseManager.onError(error, res);
    }
};

export const clientList = async (req, res) => {
    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const InstagramModel = primary.model(constants.MODELS.instagram, instagramSchema);

        const query = { isDeleted: false, status: true };
        const result = await InstagramModel.find(query).sort({ createdAt: -1 }).limit(20);
        
        return responseManager.onSuccess('Instagram feeds fetched successfully', result, res);
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
