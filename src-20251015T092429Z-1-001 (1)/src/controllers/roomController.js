const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Single', 'Double', 'Suite', 'Deluxe']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  },
  description: {
    type: String,
    trim: true
  },
  amenities: [{
    type: String
  }],
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  }
}, {
  timestamps: true
});

// Index for faster queries
roomSchema.index({ status: 1, type: 1 });
roomSchema.index({ number: 1 });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
