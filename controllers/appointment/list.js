import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import appointmentSchema from '../../models/appointment.js';
import categorySchema from '../../models/category.js';

export const list = async (req, res) => {
    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        primary.model(constants.MODELS.category, categorySchema);
        const AppointmentModel = primary.model(constants.MODELS.appointment, appointmentSchema);

        const appointments = await AppointmentModel.find()
            .populate({ path: 'category', select: 'name' })
            .sort({ eventDate: 1, time: 1 })
            .lean();
        return responseManager.onSuccess('Appointments fetched successfully', appointments, res);
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
