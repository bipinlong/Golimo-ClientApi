const conn = require("../services/db");
require('dotenv').config();  


// Function to generate the unique booking ID
exports.generateBookingId = async (req, res) => {
    try {
        const query = `
            SELECT MAX(bookingId) AS lastBookingId, MAX(returnBookingId) AS lastReturnBookingId
            FROM bookings
        `;
        
        const results = await new Promise((resolve, reject) => {
            conn.query(query, (err, results) => {
                if (err) {
                    console.error("Query error:", err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        
        console.log("Raw results:", results[0]);
        
        // ✅ FIX: results[0] se values le
        let lastBookingId = results[0]?.lastBookingId;
        let lastReturnBookingId = results[0]?.lastReturnBookingId;
        
        // ✅ Convert to numbers
        lastBookingId = lastBookingId ? Number(lastBookingId) : 19846000;
        lastReturnBookingId = lastReturnBookingId ? Number(lastReturnBookingId) : 19846000;
        
        // ✅ Get max and add 1
        const maxId = Math.max(lastBookingId, lastReturnBookingId);
        const newBookingId = maxId + 1;
        
        console.log("Generated new bookingId:", newBookingId);
        
        // ✅ Return as number
        res.status(200).json({ bookingId: newBookingId });
        
    } catch (error) {
        console.error('Error generating booking ID:', error);
        // ✅ Fallback using timestamp
        const fallbackId = Date.now();
        res.status(200).json({ bookingId: fallbackId });
    }
};