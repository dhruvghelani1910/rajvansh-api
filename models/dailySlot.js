import mongoose from 'mongoose';

const dailySlotSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        unique: true // Format: YYYY-MM-DD
    },
    slots: [{
        type: String // Format: "10:00 AM"
    }]
}, { timestamps: true });

export default dailySlotSchema;
