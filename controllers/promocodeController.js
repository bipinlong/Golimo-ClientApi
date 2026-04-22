const conn = require('../services/db')
require("dotenv").config();

exports.applyPromoCode = (req, res) => {
    const { promoCode } = req.body;

    // Check if promocode is provided
    if (!promoCode) {
        return res.status(400).json({ message: "Promocode is required" });
    }

    // Query the database to find the promo code
    conn.query("SELECT * FROM promocodes WHERE promocode = ? AND status = 1 AND tenant_id = ?", [promoCode, req.tenantId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }

        // Check if the promo code exists and is active
        if (results.length === 0) {
            return res.status(400).json({ message: "Promo code is either invalid or inactive" });
        }

        // Promo code found and is active
        const promo = results[0];
        return res.status(200).json({
            message: "Promo code applied successfully",
            discount: promo.discount, // Returning the discount for applying the promo code
        });
    });
};