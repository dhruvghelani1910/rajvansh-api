import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import customerSchema from '../../models/customer.js';
import mongoose from 'mongoose';

export const getone = async (req, res) => {
    const { id } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return responseManager.badrequest({ message: 'Valid ID must be provided.' }, res);
    }
    
    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const CustomerModel = primary.model(constants.MODELS.customer, customerSchema);

        let data = await CustomerModel.findById(id).lean();

        if (data) {
            return responseManager.onSuccess('Data fetched successfully', data, res);
        } else {
            return responseManager.badrequest({ message: 'Record not found' }, res);
        }
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
