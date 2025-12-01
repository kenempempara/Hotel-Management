const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  idProof: {
    type: String,
    trim: true
  },
  preferences: {
    smoking: { type: Boolean, default: false },
    floor: Number,
    roomType: String
  }
}, {
  timestamps: true
});

// Index for search functionality
guestSchema.index({ email: 1 });
guestSchema.index({ phone: 1 });

const Guest = mongoose.model('Guest', guestSchema);
module.exports = Guest;

