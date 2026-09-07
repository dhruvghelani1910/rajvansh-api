import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import dailySlotSchema from '../../models/dailySlot.js';

export const setdailyslots = async (req, res) => {
    try {
        const { date, slots } = req.body;
        if (!date || !Array.isArray(slots)) {
            return responseManager.badrequest({ message: 'Date and slots array are required.' }, res);
        }

        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const DailySlotModel = primary.model(constants.MODELS.dailySlot, dailySlotSchema);

        const updatedDailySlot = await DailySlotModel.findOneAndUpdate(
            { date },
            { slots },
            { new: true, upsert: true }
        );

        return responseManager.onSuccess('Daily slots updated successfully', updatedDailySlot, res);
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
