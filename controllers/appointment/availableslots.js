import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import appointmentSchema from '../../models/appointment.js';
import dailySlotSchema from '../../models/dailySlot.js';
import moment from 'moment';

export const availableslots = async (req, res) => {
    try {
        const { date } = req.query; // Expecting YYYY-MM-DD
        if (!date) {
            return responseManager.badrequest({ message: 'Date is required (YYYY-MM-DD).' }, res);
        }

        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const AppointmentModel = primary.model(constants.MODELS.appointment, appointmentSchema);
        const DailySlotModel = primary.model(constants.MODELS.dailySlot, dailySlotSchema);

        // Fetch slots opened by Admin for this day
        const dailySlot = await DailySlotModel.findOne({ date });
        let availableSlots = dailySlot ? dailySlot.slots : [];

        // Fetch already booked appointments for this day
        const existingAppointments = await AppointmentModel.find({
            eventDate: {
                $gte: moment(date).startOf('day').toDate(),
                $lte: moment(date).endOf('day').toDate()
            },
            status: { $ne: 'Cancelled' }
        }).select('time').lean();

        const bookedTimes = existingAppointments.map(app => app.time);

        // Filter out booked slots
        availableSlots = availableSlots.filter(slot => !bookedTimes.includes(slot));

        return responseManager.onSuccess('Available slots fetched successfully', availableSlots, res);
    } catch (error) {
        console.error("getAvailableSlots error:", error);
        return responseManager.onError(error, res);
    }
};
