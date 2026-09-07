import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import dailySlotSchema from '../../models/dailySlot.js';

export const getdailyslots = async (req, res) => {
    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const DailySlotModel = primary.model(constants.MODELS.dailySlot, dailySlotSchema);

        const slots = await DailySlotModel.find().sort({ date: 1 }).lean();
        return responseManager.onSuccess('Daily slots fetched successfully', slots, res);
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
