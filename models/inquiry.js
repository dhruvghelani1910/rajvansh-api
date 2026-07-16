import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  date: {
    type: String
  },
  location: {
    type: String
  },
  guests: {
    type: String
  },
  eventtype: {
    type: String,
    default: 'Wedding'
  },
  message: {
    type: String
  },
  timestamp: {
    type: String
  },

  // Standard fields
  status: {
    type: Boolean,
    default: true
  }, // Might be true/false instead of 'New' / 'Completed' 
  // Wait, the user had status: 'New'. I will add a string field for status text to avoid conflicting with the boolean status.
  inquiryStatus: {
    type: String,
    default: 'New'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
}, { timestamps: true, strict: false, autoIndex: true });

schema.plugin(mongoosePaginate);
export default schema;
