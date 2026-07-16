import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  avatar: {
    type: String
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
