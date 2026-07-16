import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import policySchema from '../../models/policy.js';
import mongoose from 'mongoose';

export const updatepolicy = async (req, res) => {
    const { type, content } = req.body;
    const tokenAdminId = req.token?.userid || req.token?.id || null;

    if (!type) {
        return responseManager.badrequest({ message: 'Policy type is required' }, res);
    }

    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const PolicyModel = primary.model('policy', policySchema);

        const updatedPolicy = await PolicyModel.findOneAndUpdate(
            { type },
            { type, content, updatedBy: tokenAdminId },
            { new: true, upsert: true } // Create if doesn't exist
        );

        return responseManager.onSuccess('Policy updated successfully', updatedPolicy, res);
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
