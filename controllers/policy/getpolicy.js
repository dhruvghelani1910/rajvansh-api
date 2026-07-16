import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import policySchema from '../../models/policy.js';

export const getpolicy = async (req, res) => {
    const { type } = req.body;
    
    if (!type) {
        return responseManager.badrequest({ message: 'Policy type is required' }, res);
    }

    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const PolicyModel = primary.model('policy', policySchema);

        let policy = await PolicyModel.findOne({ type }).lean();
        
        // If it doesn't exist, return empty content rather than an error
        if (!policy) {
            policy = { type, content: '' };
        }

        return responseManager.onSuccess('Policy fetched successfully', policy, res);
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
