const conn = require('../services/db')
require("dotenv").config();

exports.getBooktime = (req, res) => {
    conn.query("SELECT booktime FROM timeinterval ", (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json({ booktime: results });
      });
};

exports.getModifytime = (req, res) => {
    conn.query("SELECT modifytime FROM timeinterval ", (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Database error", error: err });
        }
      
        res.status(200).json({ modifytime: results });
      });
};

exports.getCanceltime = (req, res) => {
    conn.query("SELECT canceltime FROM timeinterval ", (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Database error", error: err });
        }
      
        res.status(200).json({ canceltime: results });
      });
};