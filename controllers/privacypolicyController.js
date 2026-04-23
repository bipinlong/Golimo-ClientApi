const conn = require("../services/db");
require('dotenv').config();  

exports.getPrivacyPolicy = (req, res) => {
    conn.query("SELECT * FROM privacy_policies", (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json(results);
    });
};