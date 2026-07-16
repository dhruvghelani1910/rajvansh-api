import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new mongoose.Schema({
  title: { 
    type: String, 
    required: false, 
    trim: true 
  },
  subtitle: {
     type: String, 
     trim: true 
    },
  description: {
     type: String, 
     trim: true 
    },
  image: {
     type: String, 
     required: true 
    },
  ctaText: {
     type: String, 
     trim: true 
    },
  link: {
     type: String, 
     trim: true 
    },
  type: { 
    type: String, 
    default: 'hero' 
  },
  order: { 
    type: Number, 
    default: 0 
  },
  textPosition: {
    type: String,
    enum: ['left', 'center', 'right', 'top', 'bottom'],
    default: 'left'
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
