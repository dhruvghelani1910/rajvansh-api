import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true
  },
  badge: {
    type: String,
    default: "",
    trim: true
  },
  heading: {
    type: String,
    required: true,
    trim: true
  },
  paragraphs: {
    type: [String],
    default: []
  },
  bullets: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    default: ""
  },
  order: {
    type: Number,
    default: 0
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
