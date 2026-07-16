import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: false
  },
  surname: {
    type: String,
    required: false,
    trim: true
  },
  address: {
    type: String,
    required: false
  },
  profilepic: {
    type: String,
    required: false,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
  },
  cart: {
    type: Array,
    default: []
  },
  wishlist: {
    type: Array,
    default: []
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

// Pre-save hook to hash password
schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
schema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

schema.plugin(mongoosePaginate);
export default schema;
