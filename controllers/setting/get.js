import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import settingSchema from '../../models/setting.js';

export const getSettings = async (req, res) => {
    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const Model = primary.model(constants.MODELS.setting, settingSchema);

        let data = await Model.findOne().lean();

        // If no settings exist yet, create default one
        if (!data) {
            data = await Model.create({});
            data = data.toObject();
        }

        return responseManager.onSuccess('Settings fetched successfully', data, res);
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
