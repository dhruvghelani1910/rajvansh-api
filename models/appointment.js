import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    }],
    bookingDate: {
        type: Date,
        default: Date.now
    },
    eventDate: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        default: ''
    },
    isMakeoverInterested: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    statusMessage: {
        type: String,
        default: ''
    },
}, { timestamps: true });

export default appointmentSchema;
