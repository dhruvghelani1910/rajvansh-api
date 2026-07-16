import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['post', 'reel'],
    required: true,
    default: 'post'
  },
  url: {
    type: String,
    required: true
  },
  embedCode: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  status: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  }
}, { timestamps: true, strict: false, autoIndex: true });

schema.plugin(mongoosePaginate);
export default schema;
