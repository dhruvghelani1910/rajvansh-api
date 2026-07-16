import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new mongoose.Schema({
  phone: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  mapLink: {
    type: String,
    default: ""
  },
  openTime: {
    type: String,
    required: true,
    default: "10:00 AM"
  },
  closeTime: {
    type: String,
    required: true,
    default: "08:30 PM"
  },
  aboutUs: {
    type: String,
    default: ""
  },
  
  // Standard fields
  status: {
    type: Boolean,
    default: true
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
