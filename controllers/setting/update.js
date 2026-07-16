import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import settingSchema from '../../models/setting.js';

export const updateSettings = async (req, res) => {
    const { ...data } = req.body;
    const tokenUserId = req.token?.userid || null;

    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const Model = primary.model(constants.MODELS.setting, settingSchema);

        let existing = await Model.findOne();

        if (existing) {
            const updatedData = await Model.findByIdAndUpdate(
                existing._id,
                { ...data, updatedBy: tokenUserId },
                { new: true, runValidators: true }
            );
            return responseManager.onSuccess('Settings updated successfully', updatedData, res);
        } else {
            const createData = await Model.create({
                ...data,
                createdBy: tokenUserId
            });
            return responseManager.onSuccess('Settings created successfully', createData, res);
        }
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
