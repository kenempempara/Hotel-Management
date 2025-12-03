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
    documentType: {
        type: String,
        enum: ['passport', 'id_card', 'driver_license']
    },
    documentNumber: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Guest', guestSchema);