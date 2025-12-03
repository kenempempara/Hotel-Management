const express = require('express');
const router = express.Router();
const {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    checkInBooking,
    checkOutBooking
} = require('../controllers/bookingController');

router.route('/')
    .get(getAllBookings)
    .post(createBooking);

router.route('/:id')
    .get(getBookingById)
    .put(updateBooking)
    .delete(deleteBooking);

router.put('/:id/checkin', checkInBooking);
router.put('/:id/checkout', checkOutBooking);

module.exports = router;