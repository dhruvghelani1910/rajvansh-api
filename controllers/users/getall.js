import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import customerSchema from '../../models/customer.js';

export const getall = async (req, res) => {
    const { page = 1, limit = 10, search = '', sortfield = 'createdAt', sortoption = -1 } = req.body;

    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const CustomerModel = primary.model(constants.MODELS.customer, customerSchema);

        let query = { isDeleted: false };
        if (search) {
            query.$or = [
                { username: { $regex: new RegExp(search, 'i') } },
                { email: { $regex: new RegExp(search, 'i') } },
                { phone: { $regex: new RegExp(search, 'i') } }
            ];
        }

        CustomerModel.paginate(query, {
            page,
            limit: parseInt(limit),
            sort: { [sortfield]: sortoption },
            lean: true
        }).then((data) => {
            return responseManager.onSuccess('Customers fetched successfully', data, res);
        }).catch((error) => {
            return responseManager.onError(error, res);
        });

    } catch (error) {
        return responseManager.onError(error, res);
    }
};
