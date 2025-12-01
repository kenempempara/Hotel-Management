const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled'],
    default: 'confirmed'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    trim: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
bookingSchema.index({ guestId: 1 });
bookingSchema.index({ roomId: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ status: 1 });

// Middleware to update room status
bookingSchema.post('save', async function(doc) {
  const Room = mongoose.model('Room');
  const roomStatus = doc.status === 'checked-in' ? 'occupied' : 'available';
  await Room.findByIdAndUpdate(doc.roomId, { status: roomStatus });
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
