import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import appointmentSchema from '../../models/appointment.js';

export const updatestatus = async (req, res) => {
    try {
        const { id, status, statusMessage } = req.body;
        if (!id || !status) {
            return responseManager.badrequest({ message: 'Appointment ID and Status are required.' }, res);
        }

        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const AppointmentModel = primary.model(constants.MODELS.appointment, appointmentSchema);

        const appointment = await AppointmentModel.findByIdAndUpdate(
            id,
            { status, statusMessage: statusMessage || '' },
            { new: true }
        );

        return responseManager.onSuccess('Appointment updated successfully', appointment, res);
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
