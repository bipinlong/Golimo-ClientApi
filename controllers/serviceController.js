const conn = require('../services/db')
require("dotenv").config();

exports.getServices = (req, res) => {
  conn.query("SELECT * FROM services WHERE status = 1", (err, results) => {
    if (err) {
      console.error("DB ERROR:", err); // 👈 add this
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json({ services: results });
  });
};