const conn = require("../services/db");
require('dotenv').config();  

// Function to generate the unique booking ID
exports.generateBookingId = async (req, res) => {
    try {
        // Fetch the latest bookingId and returnBookingId from the database
        const { lastBookingId, lastReturnBookingId } = await getLastBookingIdFromDatabase();

        // Select the maximum value from both bookingId and returnBookingId
        const bookingId = Math.max(lastBookingId, lastReturnBookingId) + 1;

        // Return the newly generated booking ID as a response
        res.status(200).json({ bookingId });
    } catch (error) {
        console.error('Error generating booking ID:', error);
        return res.status(500).json({ error: 'Failed to generate booking ID' });
    }
};

// Helper function to get the last bookingId and returnBookingId from the database
const getLastBookingIdFromDatabase = async () => {
    const query = `
        SELECT MAX(bookingId) AS lastBookingId, MAX(returnBookingId) AS lastReturnBookingId
        FROM bookings
    `;
    return new Promise((resolve, reject) => {
        conn.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                const lastBookingId = results[0].lastBookingId || 19846000; // Default value if no bookings exist
                const lastReturnBookingId = results[0].lastReturnBookingId || 19846000; // Default value if no bookings exist
                resolve({ lastBookingId, lastReturnBookingId });
            }
        });
    });
};
