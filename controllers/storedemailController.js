const conn = require("../services/db");
require("dotenv").config();
const { validationResult } = require("express-validator");
const generateSafeTwoDigitId = require("../helpers/cardHelpers");

// GET stored emails
exports.getStoredEmails = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId, "user id")
    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const [rows] = await conn
      .promise()
      .query("SELECT stored_email FROM user WHERE id = ?", [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    let storedEmails = [];
    try {
      storedEmails = rows[0].stored_email
        ? JSON.parse(rows[0].stored_email)
        : [];
    } catch (err) {
      console.error("Error parsing stored_email:", err);
      return res
        .status(500)
        .json({ msg: "Failed to parse stored email data" });
    }

    if (!Array.isArray(storedEmails)) storedEmails = [];

    return res.status(200).json({ storedemail: storedEmails });
  } catch (error) {
    console.error("Error fetching stored emails:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// ADD stored email
exports.addStoredEmail = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, emailToReceive, autoNotifications } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const [rows] = await conn
      .promise()
      .query("SELECT stored_email FROM user WHERE id = ?", [userId]);

    let storedEmails = [];

    if (rows.length && rows[0].stored_email) {
      try {
        const parsed = JSON.parse(rows[0].stored_email);
        storedEmails = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        console.error("Error parsing stored_email:", e);
      }
    }

    const existingIds = storedEmails.map((e) => e.id);
    const newId = generateSafeTwoDigitId(existingIds);

    storedEmails.push({
      id: newId,
      email,
      emailToReceive: Array.isArray(emailToReceive) ? emailToReceive : [],
      autoNotifications: !!autoNotifications
    });

    await conn
      .promise()
      .query("UPDATE user SET stored_email = ? WHERE id = ?", [
        JSON.stringify(storedEmails),
        userId
      ]);

    res
      .status(201)
      .json({ status: "success", msg: "Stored email added", id: newId });
  } catch (error) {
    console.error("Add stored email error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// EDIT stored email
exports.editStoredEmail = async (req, res) => {
  try {
    const { userId, id } = req.params;
    const updatedData = req.body;

    const [rows] = await conn
      .promise()
      .query("SELECT stored_email FROM user WHERE id = ?", [userId]);

    let storedEmails = [];
    if (rows.length && rows[0].stored_email) {
      try {
        const parsed = JSON.parse(rows[0].stored_email);
        storedEmails = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error("Error parsing stored_email:", e);
      }
    }

    const index = storedEmails.findIndex(
      (e) => String(e.id) === String(id)
    );
    if (index === -1) {
      return res.status(404).json({ msg: "Stored email not found" });
    }

    storedEmails[index] = { ...storedEmails[index], ...updatedData };

    await conn
      .promise()
      .query("UPDATE user SET stored_email = ? WHERE id = ?", [
        JSON.stringify(storedEmails),
        userId
      ]);

    res.status(200).json({ status: "success", msg: "Stored email updated" });
  } catch (error) {
    console.error("Edit stored email error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// DELETE stored email
exports.deleteStoredEmail = async (req, res) => {
  try {
    const { userId, id } = req.params;

    const [rows] = await conn
      .promise()
      .query("SELECT stored_email FROM user WHERE id = ?", [userId]);

    let storedEmails = [];
    if (rows.length && rows[0].stored_email) {
      try {
        const parsed = JSON.parse(rows[0].stored_email);
        storedEmails = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error("Error parsing stored_email:", e);
      }
    }

    const updatedEmails = storedEmails.filter(
      (e) => String(e.id) !== String(id)
    );

    if (updatedEmails.length === storedEmails.length) {
      return res.status(404).json({ msg: "Stored email not found" });
    }

    await conn
      .promise()
      .query("UPDATE user SET stored_email = ? WHERE id = ?", [
        JSON.stringify(updatedEmails),
        userId
      ]);

    res.status(200).json({ status: "success", msg: "Stored email deleted" });
  } catch (error) {
    console.error("Delete stored email error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
