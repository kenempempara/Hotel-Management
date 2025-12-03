const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Guest = require('../models/Guest');

// Get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('guestId', 'name email phone')
            .populate('roomId', 'number type price');
        
        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get single booking
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('guestId', 'name email phone')
            .populate('roomId', 'number type price amenities');
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }
        
        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Create booking
const createBooking = async (req, res) => {
    try {
        // Check if guest exists
        const guest = await Guest.findById(req.body.guestId);
        if (!guest) {
            return res.status(404).json({
                success: false,
                error: 'Guest not found'
            });
        }
        
        // Check if room exists and is available
        const room = await Room.findById(req.body.roomId);
        if (!room) {
            return res.status(404).json({
                success: false,
                error: 'Room not found'
            });
        }
        
        if (room.status !== 'available') {
            return res.status(400).json({
                success: false,
                error: 'Room is not available'
            });
        }
        
        // Check room capacity
        if (req.body.numberOfGuests > room.capacity) {
            return res.status(400).json({
                success: false,
                error: 'Number of guests exceeds room capacity'
            });
        }
        
        // Check for overlapping bookings
        const overlappingBooking = await Booking.findOne({
            roomId: req.body.roomId,
            $or: [
                {
                    checkIn: { $lt: new Date(req.body.checkOut) },
                    checkOut: { $gt: new Date(req.body.checkIn) }
                }
            ],
            status: { $in: ['confirmed', 'checked-in'] }
        });
        
        if (overlappingBooking) {
            return res.status(400).json({
                success: false,
                error: 'Room is already booked for the selected dates'
            });
        }
        
        // Calculate total amount
        const checkIn = new Date(req.body.checkIn);
        const checkOut = new Date(req.body.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalAmount = nights * room.price;
        
        const bookingData = {
            ...req.body,
            totalAmount
        };
        
        const booking = await Booking.create(bookingData);
        
        // Update room status
        room.status = 'occupied';
        await room.save();
        
        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update booking
const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('guestId roomId');
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }
        
        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete booking
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }
        
        // Update room status back to available
        if (booking.status !== 'cancelled') {
            const room = await Room.findById(booking.roomId);
            if (room) {
                room.status = 'available';
                await room.save();
            }
        }
        
        await booking.deleteOne();
        
        res.json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Check-in booking
const checkInBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }
        
        booking.status = 'checked-in';
        await booking.save();
        
        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Check-out booking
const checkOutBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }
        
        booking.status = 'checked-out';
        booking.paymentStatus = 'paid';
        await booking.save();
        
        // Update room status back to available
        const room = await Room.findById(booking.roomId);
        if (room) {
            room.status = 'available';
            await room.save();
        }
        
        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    checkInBooking,
    checkOutBooking
};