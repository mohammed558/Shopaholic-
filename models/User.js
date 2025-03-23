// Models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Automatically set the joined field to the current date when the document is created.
  joined: {
    type: Date,
    default: Date.now,
  },
  // Field to record the date of the last login
  login_date: {
    type: Date,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);