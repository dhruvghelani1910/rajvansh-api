import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import appointmentSchema from '../../models/appointment.js';
import dailySlotSchema from '../../models/dailySlot.js';
import whatsapp from '../../utilities/whatsapp.js';
import moment from 'moment';

export const create = async (req, res) => {
    try {
        const { name, category, eventDate, time, address, mobile, requirements, isMakeoverInterested } = req.body;

        if (!name || !category || !eventDate || !time || !address || !mobile) {
            return responseManager.badrequest({ message: 'All required fields must be provided.' }, res);
        }

        const categoryArray = Array.isArray(category) ? category : (category ? [category] : []);
        if (categoryArray.length === 0) {
            return responseManager.badrequest({ message: 'At least one category must be selected.' }, res);
        }

        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const AppointmentModel = primary.model(constants.MODELS.appointment, appointmentSchema);
        const DailySlotModel = primary.model(constants.MODELS.dailySlot, dailySlotSchema);

        // Ensure the slot is valid for the day
        const formattedDate = moment(eventDate).format('YYYY-MM-DD');
        const dailySlot = await DailySlotModel.findOne({ date: formattedDate });

        if (!dailySlot || !dailySlot.slots.includes(time)) {
            return responseManager.badrequest({ message: 'The selected time slot is not available for this date.' }, res);
        }

        // Check for double booking
        const existingAppointment = await AppointmentModel.findOne({
            eventDate: {
                $gte: moment(formattedDate).startOf('day').toDate(),
                $lte: moment(formattedDate).endOf('day').toDate()
            },
            time: time,
            status: { $ne: 'Cancelled' }
        });

        if (existingAppointment) {
            return responseManager.badrequest({ message: 'This time slot is already booked. Please select another time.' }, res);
        }

        // Create appointment
        const appointment = await AppointmentModel.create({
            name,
            category: categoryArray,
            eventDate: moment(formattedDate).toDate(),
            time,
            address,
            mobile,
            requirements: requirements || '',
            isMakeoverInterested: isMakeoverInterested || false
        });

        // Send WhatsApp notification
        await whatsapp.sendAppointmentNotification(appointment);

        return responseManager.onSuccess('Appointment booked successfully!', appointment, res);
    } catch (error) {
        console.error("create appointment error:", error);
        return responseManager.onError(error, res);
    }
};
