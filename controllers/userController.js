const { validationResult } = require("express-validator");
const conn = require("../services/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const welcomeTemplate = require('../utils/welcomeTemplate')
require("dotenv").config();
const nodemailer = require('nodemailer')
const generateSafeTwoDigitId = require('../helpers/cardHelpers')
const { generateInvoiceEmailTemplate } = require('../utils/InvoiceTemplate');

const token_key = process.env.TOKEN_KEY;

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

exports.registerUser = async (req, res) => {
  try {
    const { firstname, middlename, lastname, prefix, email, phone, password, confirmPassword, receive_notifications} = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match!" });
    }

    // Check if email already exists
    const [existingUser] = await conn.promise().query(`SELECT * FROM user WHERE email = ? AND tenant_id = ?`, [email, req.tenantId]);
    if (existingUser.length) {
      return res.status(400).json({ msg: "User already exists!" });
    }

    // Generate account number by checking max existing
    const [maxResult] = await conn.promise().query(`SELECT MAX(CAST(account_number AS UNSIGNED)) AS max_account FROM user WHERE account_number IS NOT NULL`);
    let newAccountNumber = 30340; // Starting value if no account_number yet
    //30501
    if (maxResult[0].max_account) {
      newAccountNumber = parseInt(maxResult[0].max_account) + 1;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user with generated account number
    const sql = `INSERT INTO user (firstname, middlename, lastname, prefix, email, phone, password, account_number, receive_notifications, tenant_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await conn.promise().query(sql, [firstname, middlename, lastname, prefix, email, phone, hashedPassword, newAccountNumber,  receive_notifications ? 1 : 0]);

    // Send response immediately
    res.status(201).json({ 
      msg: "User registered successfully!",
      accountNumber: newAccountNumber
    });

    const { userTemplate, adminTemplate } = welcomeTemplate({
      prefix,
      firstname,
      middlename,
      lastname,
      accountNumber: newAccountNumber,
      // companyName: "",         
      phoneNumber: phone,
      emailAddress: email,
      password
    });
    transporter.sendMail({
      from :process.env.SMTP_USER,
      to:email,
      subject:`Account Number ${newAccountNumber}`,
      html:userTemplate,
    },(error) =>{
      if(error) console.error('Error sending user email')
    });
    
    transporter.sendMail({
      from:process.env.SMTP_USER,
      // to: process.env.ADMIN_EMAIL,
      //to:'bipinlongjam11@gmail.com',
      to: ["bipinlongjam11@gmail.com", "account_request@bostonasapcoach.com "],
      subject:`New Account Created - ${firstname} ${lastname}`,
      html:adminTemplate
    },(error) =>{
      if(error) console.error('Error sending admin email', error)
    })

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Fetch user from DB
    const [users] = await conn.promise().query(`SELECT * FROM user WHERE email = ? AND tenant_id = ?`, [email, req.tenantId]);
    if (users.length === 0) {
      return res.status(400).json({ msg: "Email or Password is incorrect!" });
    }

    const user = users[0];

    // Compare passwords asynchronously
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Email or Password is incorrect!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      token_key,
      { expiresIn: "1d" }
    );

    // Update last login (non-blocking)
    conn.query(`UPDATE user SET last_login = NOW() WHERE id = ?`, [user.id]);

    

    res.status(200).json({
      status: "success",
      token,
      data: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        account_number: user.account_number,
        usertype: user.usertype,
        profile_completed: user.profile_completed,
        receive_notifications: user.receive_notifications,
        company_information: user.company_information,
        saved_addresses: user.saved_addresses,
        contact_information: user.contact_information,
        passengers:user.passengers,
        saved_cards: user.saved_cards,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.openAccountDetails = async (req, res) => {
  try {
    const { userId, companyInfo, addressInfo, contactInfo, cardInfo } = req.body;

    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }

    // Validate required fields
    if (!companyInfo || !addressInfo || !contactInfo || !cardInfo) {
      return res.status(400).json({ msg: 'All information fields are required' });
    }

    /* --------------------------------------------------------
       1) FETCH EXISTING USER DATA
    ---------------------------------------------------------*/
    const [userRows] = await conn
      .promise()
      .query(`SELECT saved_cards, saved_addresses, contact_information FROM user WHERE id = ?`, [
        userId,
      ]);

    if (userRows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    /* --------------------------------------------------------
       2) PROCESS CARDS
    ---------------------------------------------------------*/
    let existingCards = [];
    if (userRows[0].saved_cards) {
      try {
        existingCards = JSON.parse(userRows[0].saved_cards) || [];
      } catch (err) {
        console.error('Failed to parse saved_cards JSON:', err);
      }
    }

    const cardIds = existingCards.map((c) => c.id);
    const newCardId = generateSafeTwoDigitId(cardIds);

    const reorderedCardInfo = { 
      id: newCardId, 
      ...cardInfo,
      createdAt: new Date().toISOString()
    };
    existingCards.push(reorderedCardInfo);

    /* --------------------------------------------------------
       3) PROCESS ADDRESSES
    ---------------------------------------------------------*/
    let existingAddresses = [];
    if (userRows[0].saved_addresses) {
      try {
        existingAddresses = JSON.parse(userRows[0].saved_addresses) || [];
      } catch (err) {
        console.error('Failed to parse saved_addresses JSON:', err);
      }
    }

    const addressIds = existingAddresses.map((a) => a.id);
    const newAddressId = generateSafeTwoDigitId(addressIds);

    const reorderedAddressInfo = { 
      id: newAddressId, 
      ...addressInfo,
      createdAt: new Date().toISOString()
    };
    existingAddresses.push(reorderedAddressInfo);

    /* --------------------------------------------------------
       4) PROCESS CONTACT INFO
    ---------------------------------------------------------*/
    let existingContacts = [];
    if (userRows[0].contact_information) {
      try {
        existingContacts = JSON.parse(userRows[0].contact_information) || [];
      } catch (err) {
        console.error('Failed to parse contact_information JSON:', err);
      }
    }

    const usedContactIds = existingContacts.map((c) => c.id);
    const reorderedContactInfo = Object.entries(contactInfo).map(([type, value]) => {
      const newId = generateSafeTwoDigitId(usedContactIds);
      usedContactIds.push(newId);
      return { 
        id: newId, 
        type, 
        value,
        createdAt: new Date().toISOString()
      };
    });

    // Merge with existing contacts
    const updatedContacts = [...existingContacts, ...reorderedContactInfo];

    /* --------------------------------------------------------
       5) PREPARE COMPANY INFO WITH ADDRESS
    ---------------------------------------------------------*/
    const companyWithAddress = {
      ...companyInfo,
      address: addressInfo, // Use the original addressInfo, not the one with ID
      updatedAt: new Date().toISOString()
    };

    /* --------------------------------------------------------
       6) UPDATE USER ROW
    ---------------------------------------------------------*/
    const sql = `
      UPDATE user 
      SET 
        company_information = ?,
        saved_addresses = ?,
        contact_information = ?,
        saved_cards = ?,
        profile_completed = 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await conn.promise().query(sql, [
      JSON.stringify(companyWithAddress),
      JSON.stringify(existingAddresses), // Save addresses with IDs
      JSON.stringify(updatedContacts),   // Save contacts with IDs
      JSON.stringify(existingCards),     // Save cards with IDs
      userId,
    ]);

    return res.status(200).json({
      status: 'success',
      msg: 'Account profile updated successfully',
      data: {
        cardId: newCardId,
        addressId: newAddressId,
        contactIds: reorderedContactInfo.map(contact => contact.id)
      }
    });

  } catch (error) {
    console.error('Error updating open account info:', error);
    return res.status(500).json({ 
      msg: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
      const userId = req.params.id;
      const [result] = await conn.promise().query(
          `SELECT id, firstname, lastname, email, phone, account_number FROM user WHERE id = ?`,
          [userId]
      );

      if (!result.length) {
          return res.status(404).json({ msg: "User not found" });
      }

      res.status(200).json({
          msg: "User details fetched successfully",
          user: result[0],
      });
  } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ msg: "Database error" });
  }
};

// Update User Details
exports.updateUserDetails = async (req, res) => {
  try {
      const { firstname, lastname, email, phone, password } = req.body;
      const userId = req.params.id;

      // Hash password only if provided
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

      const sql = `UPDATE user SET 
                  firstname = ?, 
                  lastname = ?, 
                  email = ?, 
                  phone = ?${password ? ", password = ?" : ""} 
                  WHERE id = ?`;

      const params = [firstname, lastname, email, phone, ...(password ? [hashedPassword] : []), userId];

      const [updateResult] = await conn.promise().query(sql, params);

      if (updateResult.affectedRows === 0) {
          return res.status(404).json({ msg: "User not found or no changes made" });
      }

      res.status(200).json({ msg: "User updated successfully!" });
  } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ msg: "Error updating user" });
  }
};

// Fetch Booking Details for the Logged-in User by Email
exports.getRidesByEmail = async (req, res) => {
  try {
      // const userEmail = req.params.email;
      const account_number = req.params.account_number

      const [result] = await conn.promise().query(
          `SELECT * FROM bookings WHERE account_number = ?`,
          [account_number]
      );

      res.status(200).json({
          msg: result.length
              ? "Booking details fetched successfully"
              : "No bookings found for the provided email",
          bookings: result,
      });
  } catch (error) {
      console.error("Error fetching booking details:", error);
      res.status(500).json({ msg: "Database error" });
  }
};

// Fetch Booking Details for the Logged-in User by account number
exports.getInvoicesByAccountNumber = async (req, res) => {
  try {
      // const userEmail = req.params.email;
      const account_number = req.params.account_number

      const [result] = await conn.promise().query(
          `SELECT * FROM bookings WHERE account_number = ? AND invoiceStatus IS NOT NULL`,
          [account_number]
      );

      res.status(200).json({
          msg: result.length
              ? "Booking details fetched successfully"
              : "No bookings found for the provided email",
          bookings: result,
      });
  } catch (error) {
      console.error("Error fetching booking details:", error);
      res.status(500).json({ msg: "Database error" });
  }
};

exports.sendInvoiceEmail = async (req, res) => {
    const { bookingId } = req.body; // Remove templateType from request

    try {
        if (!bookingId) {
            return res.status(400).json({ error: 'bookingId is required' });
        }

        // Fetch booking details
        const query = 'SELECT * FROM bookings WHERE bookingId = ?';
        conn.query(query, [bookingId], async (err, results) => {
            if (err) {
                console.error('Error fetching booking:', err);
                return res.status(500).json({ error: 'Failed to fetch booking details' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            const booking = results[0];
            
            // Parse booking data
            const billingContact = JSON.parse(booking.billingContact || '{}');
            const orderData = JSON.parse(booking.orderData || '{}');
            const billingDetails = JSON.parse(booking.billingDetails || '{}');
            
            // Get user email from booking
            const userEmail = booking.email || billingContact.email;
            
            if (!userEmail) {
                return res.status(400).json({ error: 'No email found for this booking' });
            }

            // Auto-detect template type from invoiceBill data
            let templateType = 'template1'; // Default fallback
            let invoiceData = {};

            if (booking.invoiceBill) {
                invoiceData = typeof booking.invoiceBill === 'string' 
                    ? JSON.parse(booking.invoiceBill) 
                    : booking.invoiceBill;
                
                // Determine template type from invoice data
                if (invoiceData.templateType) {
                    templateType = invoiceData.templateType;
                } else if (invoiceData.accountBillingType) {
                    // Fallback: determine from billing type
                    templateType = invoiceData.accountBillingType.includes('Credit Card') 
                        ? 'template1' 
                        : 'template2';
                } else if (booking.paymentdetails) {
                    // Fallback: check if payment details exist for credit card
                    const paymentDetails = JSON.parse(booking.paymentdetails || '{}');
                    const hasCreditCard = paymentDetails.cardNumber || paymentDetails.paymentMethod === 'Credit Card';
                    templateType = hasCreditCard ? 'template1' : 'template2';
                }
            } else {
                // If no invoiceBill data, determine from payment details
                if (booking.paymentdetails) {
                    const paymentDetails = JSON.parse(booking.paymentdetails || '{}');
                    const hasCreditCard = paymentDetails.cardNumber || paymentDetails.paymentMethod === 'Credit Card';
                    templateType = hasCreditCard ? 'template1' : 'template2';
                }
            }

            console.log(`Auto-detected template type: ${templateType} for booking ${bookingId}`);

            // Generate email content
            const emailContent = generateInvoiceEmailTemplate({
                booking,
                invoiceData,
                billingContact,
                orderData,
                billingDetails,
                templateType
            });

            // Send email
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: userEmail,
                cc: process.env.BILLING_CC_EMAIL || '', // Optional CC for billing department
                subject: `Invoice #${invoiceData.invoiceNumber || booking.bookingId} - BostonAsapCoach, Inc.`,
                html: emailContent
            };

            const emailResponse = await transporter.sendMail(mailOptions);
            console.log('Invoice email sent:', emailResponse);
            res.status(200).json({ 
                message: 'Invoice email sent successfully',
                sentTo: userEmail,
                templateType: templateType // Return detected template type for reference
            });

        });
    } catch (error) {
        console.error('Error sending invoice email:', error);
        res.status(500).json({ error: 'Failed to send invoice email' });
    }
};

// exports.getRidesByEmail = async (req, res) => {
//   try {
//     const account_number = req.params.account_number;
//     const { status, startDate, endDate, keyword } = req.query;

//     let sql = `SELECT * FROM bookings WHERE account_number = ?`;
//     let params = [account_number];

//     // ✅ Status filter
//    // ✅ Status filter
//     if (status && status !== "all") {
//       // Capitalize first letter and keep rest lowercase
//       const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

//       sql += ` AND orderStatus = ?`;
//       params.push(formattedStatus);
//     }

//     console.log(status, "status")
//     // ✅ Date filters (handles both YYYY-MM-DD and ISO datetime)
//     if (startDate) {
//     sql += ` AND LEFT(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.pickUpDate')), 10) >= ?`;
//     params.push(startDate);
//     }

//     if (endDate) {
//       sql += ` AND LEFT(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.pickUpDate')), 10) <= ?`;
//       params.push(endDate);
//     }

//     console.log(endDate, "end date")
//     // ✅ Keyword filter
//     if (keyword) {
//       const like = `%${keyword.toLowerCase()}%`;
//       sql += ` AND (
//         LOWER(bookingId) LIKE ? 
//         OR LOWER(CONCAT(firstName, ' ', lastName)) LIKE ? 
//         OR LOWER(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.pickupCoords.address'))) LIKE ? 
//         OR LOWER(JSON_UNQUOTE(JSON_EXTRACT(orderData, '$.dropoffCoords.address'))) LIKE ?
//       )`;
//       params.push(like, like, like, like);
//     }

//     sql += ` ORDER BY CAST(bookingId AS UNSIGNED) DESC`;

//     const [result] = await conn.promise().query(sql, params);

//     res.status(200).json({
//       msg: result.length
//         ? "Booking details fetched successfully"
//         : "No bookings found for the provided filters",
//       bookings: result,
//     });
//   } catch (error) {
//     console.error("Error fetching booking details:", error);
//     res.status(500).json({ msg: "Database error" });
//   }
// };


