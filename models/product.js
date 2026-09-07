import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new mongoose.Schema({
  productname: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },
  color: {
    type: String,
    trim: true
  },
  code: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  mrp: {
    type: Number,
    required: false
  },
  main_image: {
    type: String,
    required: true,
    trim: true
  },
  productimage: [{
    type: String,
    trim: true
  }],
  availability: {
    type: String,
    default: 'Available',
    trim: true
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  quantity: {
    type: Number,
    default: 0
  },
  purpose: {
    type: String,
    enum: ['Rent', 'Sell', 'Both'],
    default: 'Sell'
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
