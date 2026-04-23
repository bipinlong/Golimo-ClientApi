const { validationResult } = require("express-validator");
const conn = require("../services/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const passwordResetTemplate = require('../utils/passwordResetTemplate')
require("dotenv").config();

const token_key = process.env.TOKEN_KEY;
const resetTokenKey = process.env.RESET_TOKEN_KEY;  

// Function to generate a password reset token and send the link via email
exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    // Check if the email exists in the database
    conn.query("SELECT * FROM user WHERE email = ? AND tenant_id = ?", [email, req.tenantId], (err, result) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).send({ msg: "Database error" });
        }
        if (!result.length) {
            return res.status(404).send({ msg: "Email id is not Registered" });
        }

        // Generate a reset token
        const resetToken = jwt.sign(
            { email: result[0].email },
            resetTokenKey,
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        // Store the reset token in the database for later verification (optional)
        conn.query("UPDATE user SET reset_token = ? WHERE email = ?", [resetToken, email], (err) => {
            if (err) {
                console.error("Error updating user:", err);
                return res.status(500).send({ msg: "Error updating user" });
            }

            // Send the reset link via email
           // const resetLink = `http://localhost:5173/resetpassword?token=${resetToken}`;
            const resetLink = `https://www.bostonasapcoach.com/book-ride/resetpassword?token=${resetToken}`;

            const { emailSubject, emailBody } = passwordResetTemplate({
                firstName: result[0].firstname,
                email: result[0].email,
                resetLink,
            });

            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,  // Sherweb SMTP server
                port: process.env.SMTP_PORT,  // 587
                secure: false,  // `false` for STARTTLS
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });            

            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: `Password Reset Request for ${result[0].firstname}`,
                html: emailBody, // Use the new template
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error("Error sending email:", err);
                    return res.status(500).send({ msg: "Error sending email" });
                }

                res.status(200).send({ msg: "Password reset link sent to your email" });
            });
        });
    });
};

exports.verifyResetToken = (req, res) => {
    const { token } = req.params;
  
    jwt.verify(token, resetTokenKey, (err, decoded) => {
      if (err) {
        return res.status(400).send({ msg: "Invalid or expired token" });
      }
  
      res.status(200).send({ msg: "Token is valid", email: decoded.email });
    });
  };

// Function to verify the reset token and update the password
exports.resetPassword = (req, res) => {
    const { token, newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).send({ msg: "New password is required" });
    }

    jwt.verify(token, resetTokenKey, (err, decoded) => {
        if (err) {
            return res.status(400).send({ msg: "Invalid or expired token" });
        }

        conn.query("SELECT * FROM user WHERE email = ?", [decoded.email], (err, result) => {
            if (err) {
                console.error("Error querying database:", err);
                return res.status(500).send({ msg: "Database error" });
            }

            if (!result.length) {
                return res.status(404).send({ msg: "User not found" });
            }

            const hashedPassword = bcrypt.hashSync(newPassword, 10);

            conn.query("UPDATE user SET password = ?, reset_token = NULL WHERE email = ?", [hashedPassword, decoded.email], (err) => {
                if (err) {
                    console.error("Error updating password:", err);
                    return res.status(500).send({ msg: "Error updating password" });
                }

                res.status(200).send({ msg: "Password has been reset successfully" });
            });
        });
    });
};