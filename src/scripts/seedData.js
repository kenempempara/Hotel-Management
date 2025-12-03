require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('../models/Room');
const Guest = require('../models/Guest');
const Booking = require('../models/Booking');

const connectDB = require('../config/database');

const seedData = async () => {
    try {
        await connectDB();
        
        // Clear existing data
        await Room.deleteMany({});
        await Guest.deleteMany({});
        await Booking.deleteMany({});
        
        console.log('Cleared existing data...');
        
        // Create rooms
        const rooms = [
            {
                number: '101',
                type: 'single',
                price: 100,
                status: 'available',
                amenities: ['WiFi', 'TV', 'AC'],
                capacity: 1
            },
            {
                number: '102',
                type: 'double',
                price: 150,
                status: 'available',
                amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'],
                capacity: 2
            },
            {
                number: '201',
                type: 'suite',
                price: 250,
                status: 'available',
                amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi'],
                capacity: 3
            },
            {
                number: '202',
                type: 'deluxe',
                price: 300,
                status: 'maintenance',
                amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Balcony'],
                capacity: 4
            }
        ];
        
        const createdRooms = await Room.insertMany(rooms);
        console.log(`Created ${createdRooms.length} rooms`);
        
        // Create guests
        const guests = [
            {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+1234567890',
                address: {
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    country: 'USA',
                    zipCode: '10001'
                }
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '+0987654321',
                documentType: 'passport',
                documentNumber: 'AB123456'
            }
        ];
        
        const createdGuests = await Guest.insertMany(guests);
        console.log(`Created ${createdGuests.length} guests`);
        
        // Create bookings
        const bookings = [
            {
                guestId: createdGuests[0]._id,
                roomId: createdRooms[0]._id,
                checkIn: new Date('2024-01-15'),
                checkOut: new Date('2024-01-20'),
                status: 'confirmed',
                totalAmount: 500,
                numberOfGuests: 1,
                paymentStatus: 'paid'
            },
            {
                guestId: createdGuests[1]._id,
                roomId: createdRooms[1]._id,
                checkIn: new Date('2024-01-18'),
                checkOut: new Date('2024-01-22'),
                status: 'confirmed',
                totalAmount: 600,
                numberOfGuests: 2,
                specialRequests: 'Late check-in please'
            }
        ];
        
        const createdBookings = await Booking.insertMany(bookings);
        console.log(`Created ${createdBookings.length} bookings`);
        
        // Update room status for booked rooms
        await Room.findByIdAndUpdate(createdRooms[0]._id, { status: 'occupied' });
        await Room.findByIdAndUpdate(createdRooms[1]._id, { status: 'occupied' });
        
        console.log('Seed data created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();