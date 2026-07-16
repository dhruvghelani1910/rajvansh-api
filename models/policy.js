import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['privacy', 'terms', 'shipping', 'return', 'exchange'],
    unique: true
  },
  content: {
    type: String,
    default: ''
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
}, { timestamps: true, strict: false });

export default schema;
