const express = require('express');
const router = express.Router();
const {
    getAllGuests,
    getGuestById,
    createGuest,
    updateGuest,
    deleteGuest
} = require('../controllers/guestController');

router.route('/')
    .get(getAllGuests)
    .post(createGuest);

router.route('/:id')
    .get(getGuestById)
    .put(updateGuest)
    .delete(deleteGuest);

module.exports = router;