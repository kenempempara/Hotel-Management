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
    numberOfGuests: {
        type: Number,
        required: true,
        min: 1
    },
    specialRequests: String,
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ guestId: 1 });
bookingSchema.index({ roomId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);