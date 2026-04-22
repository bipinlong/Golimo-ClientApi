

const { validationResult } = require("express-validator");
const conn = require("../services/db");
require('dotenv').config();  
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const { generateQuoteEmail, generateReservationEmail } = require('../utils/emailTemplate')
const {generateBookingEmailAdmin} = require('../utils/adminEmailTemplate')
const {generateBookingModificationEmail, generateAdminBookingModificationEmail } = require('../utils/emailModificationTemplate')
const { cancellationTemplate} = require('./../utils/cancelledEmailTemplate')
const {generateAdminBookingCancelEmail} = require('./../utils/cancelledEmailTemplate')
const { promisify } = require("util");
const confidentialityNotice = require('./../utils/confidentialityNotice')
const generateUserEmailContent = require('./../utils/userEmailTemplate')
const queryAsync = promisify(conn.query).bind(conn);
const generateSafeTwoDigitId = require('../helpers/cardHelpers')


 

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


exports.getGuestBookings = (req, res) => {
    const query = 'SELECT * FROM bookings WHERE userType = "guest" AND tenant_id = ?';

    conn.query(query, [req.tenantId], (err, results) => {
        if (err) {
            console.error('Error fetching guest bookings:', err);
            return res.status(500).json({ error: 'Failed to fetch guest bookings' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No guest bookings found' });
        }
        res.status(200).json({ message: 'Guest bookings fetched successfully', bookings: results });
    });
};

async function savePayment({ bookingId, accountnumber, paymentDetails }) {
    try {
        if (!paymentDetails) return;

        const { paymentMethod, stripe } = paymentDetails;

        // ✅ Only save Stripe payments (can extend later)
        if (paymentMethod === "Stripe" && stripe) {
            await queryAsync(`
                INSERT INTO payments (
                    bookingId,
                    account_number,
                    payment_method,
                    payment_intent_id,
                    amount,
                    currency,
                    status
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                bookingId,
                accountnumber || null,
                paymentMethod,
                stripe.paymentIntentId,
                stripe.amount,
                stripe.currency,
                stripe.status
            ]);

            console.log("✅ Payment saved successfully");
        }

    } catch (error) {
        console.error("❌ Error saving payment:", error);
    }
}

exports.addBooking = async (req, res) => {
    try {
        const {
            bookingId,
            accountnumber,
            firstName,
            lastName,
            email,
            phone,
            combinedData,
            returnService,
            paymentDetails,
            userType,
            bookActionType,
            bookingTime,
            billingContact
        } = req.body;

        console.log(bookingTime, "booking time")
        console.log("Received userType:", userType);

        const returnBookingId = returnService ? returnService.returnBookingId : null;

        if (userType === "guest") {
            handleGuestBooking(firstName, lastName, email, phone, bookingId, combinedData, returnService, paymentDetails, returnBookingId, userType, bookActionType,bookingTime, billingContact, res );
        } else if (["registered", "agent", "affiliate"].includes(userType)) {
            createBooking({
                bookingId,
                accountnumber,
                firstName,
                lastName,
                email,
                phone,
                combinedData,
                returnService,
                paymentDetails,
                returnBookingId,
                userType,
                bookActionType,
                bookingTime,
                billingContact,
                res,
            });
        } else {
            return res.status(400).json({ error: "Invalid userType provided" });
        }
    } catch (error) {
        console.error("Error in addBooking:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

async function handleGuestBooking(firstName, lastName, email, phone, bookingId, combinedData, returnService, paymentDetails, returnBookingId, userType, bookActionType, bookingTime, billingContact, res) {
    try {
        // Proceed directly with booking creation (skip account creation)
        await createBooking({
            bookingId,
            accountnumber: '00000', 
            firstName,
            lastName,
            email,
            phone,
            combinedData,
            returnService,
            paymentDetails,
            returnBookingId,
            userType,
            bookActionType,
            bookingTime,
            billingContact,
            res
        });
    } catch (error) {
        console.error("Error in handleGuestBooking:", error);
        res.status(500).json({ error: "Failed to process guest booking." });
    }
}

  async function createBooking({
    bookingId,
    accountnumber,
    firstName,
    lastName,
    email,
    phone,
    combinedData,
    returnService,
    paymentDetails,
    returnBookingId,
    bookActionType,
    userType,
    bookingTime,
    billingContact,
    res
}) {
    try {
        console.log("Processing bookActionType in createBooking:", bookActionType);

        // ================= INSERT MAIN BOOKING =================
        await queryAsync(`
            INSERT INTO bookings (
                bookingId, account_number, firstName, lastName, email, phone,
                orderData, returnservice, paymentdetails, userType,
                returnBookingId, bookActionType, billingContact
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            bookingId,
            accountnumber,
            firstName,
            lastName,
            email,
            phone,
            JSON.stringify(combinedData),
            JSON.stringify(returnService),
            JSON.stringify(paymentDetails),
            userType,
            returnBookingId,
            bookActionType,
            JSON.stringify(billingContact)
        ]);

        // ================= NEW: SAVE PAYMENT =================
        await savePayment({
            bookingId,
            accountnumber,
            paymentDetails
        });
        // ================= END NEW =================


        // ================= DATE FORMATTING =================
        const createdAt = new Date();
        const pickUpDate = combinedData.pickUpDate;
        const pickUpTime = combinedData.pickUpTime;

        const dateParts = pickUpDate.toString().split(" ");
        const monthMap = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
            Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
        };

        const formattedDate = `${monthMap[dateParts[1]]}/${dateParts[2]}/${dateParts[3]}`;

        const timeStr = pickUpTime.toString().split(" ")[4];
        const [hourStr, minuteStr] = timeStr.split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        const formattedTime = `${hour}:${minuteStr} ${ampm}`;

        // ================= EMAIL =================
        sendBookingEmail(
            bookingId,
            firstName,
            lastName,
            email,
            phone,
            combinedData,
            returnService,
            paymentDetails,
            bookActionType,
            formattedDate,
            formattedTime,
            createdAt,
            bookingTime,
            billingContact
        ).catch(console.error);

        // ================= RETURN SERVICE =================
        let returnServiceStatus = null;

        if (returnService && returnService.returnBookingId) {
            const returnId = returnService.returnBookingId;

            await queryAsync(`
                INSERT INTO bookings (
                    bookingId, account_number, firstName, lastName, email, phone,
                    orderData, returnservice, paymentdetails, userType,
                    returnBookingId, bookActionType, billingContact
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                returnId,
                accountnumber,
                firstName,
                lastName,
                email,
                phone,
                JSON.stringify(returnService),
                null,
                JSON.stringify(paymentDetails),
                userType,
                bookingId,
                bookActionType,
                JSON.stringify(billingContact)
            ]);

            // ================= NEW: SAVE RETURN PAYMENT =================
            await savePayment({
                bookingId: returnId,
                accountnumber,
                paymentDetails
            });
            // ================= END NEW =================

            returnServiceStatus = "Return service booking created";
        }

        if (!res.headersSent) {
            res.status(200).json({
                message: "Booking created successfully",
                returnService: returnServiceStatus || "No return service booked"
            });
        }

    } catch (error) {
        console.error("❌ Error inserting booking:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to create booking" });
        }
    }
}

async function sendBookingEmail(bookingId, firstName, lastName, email, phone, combinedData, returnService, paymentDetails, bookActionType, formattedDate, formattedTime, createdAt, bookingTime,billingContact, res) {
    try {
        console.log("Received bookActionType in sendBookingEmail:", bookActionType);

        if (!bookActionType) {
            console.error("Error: bookActionType is undefined or null.");
            return;
        }
        const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        let userSubject, adminSubject;

        if (bookActionType === "Request A Quote") {
            userSubject = `Quote Request Pending: Reference #${bookingId}_${capitalize(firstName)} ${capitalize(lastName)} [${formattedDate} - ${formattedTime}]`;
            adminSubject = `New Quote Request: Reference# ${bookingId}_${capitalize(firstName)} ${capitalize(lastName)} [${formattedDate} - ${formattedTime}]`;
        } else if (bookActionType === "Book Now") {
            userSubject = `Booking Request Pending: Reservation #${bookingId}_${capitalize(firstName)} ${capitalize(lastName)} [${formattedDate} - ${formattedTime}]`;
            adminSubject = `New Booking: Reservation# ${bookingId}_${capitalize(firstName)} ${capitalize(lastName)} [${formattedDate} - ${formattedTime}]`;
        } else {
            console.error("Invalid bookActionType provided:", bookActionType);
            return;
        }
        const adminEmailContent = generateBookingEmailAdmin({
            bookingId,
            firstName,
            lastName,
            email,
            phone,
            combinedData,
            returnService,
            paymentDetails,
            bookActionType,
            formattedDate,
            createdAt,
            formattedTime,
            bookingTime,
            billingContact
        });
    
        console.log(combinedData, "combined Data")

        const userRecipients = billingContact?.email && billingContact.email !== email
            ? [email, billingContact.email]
            : [email];

       setImmediate(() => {
            Promise.all([
                ...userRecipients.map(recipientEmail =>
                    transporter.sendMail({
                        from: process.env.SMTP_USER,
                        to: recipientEmail,
                        subject: userSubject,
                        html: generateUserEmailContent(
                            bookingId,
                            formattedDate,
                            formattedTime,
                            bookActionType,
                            bookingTime,
                            firstName,
                            lastName,
                            email,
                            createdAt,
                            bookingTime,
                            billingContact
                        ),
                    })
                ),
                transporter.sendMail({
                    from: process.env.SMTP_USER,
                   // to: "bipin.xelogic@gmail.com",
                     to: ["bipinlongjam11@gmail.com", "fax@bostonasapcoach.com"],
                    subject: adminSubject,
                    html: adminEmailContent,
                }),
            ])
            .then(() => console.log("Booking email sent successfully."))
            .catch(error => console.error("Error sending booking email:", error));
        });
    } catch (error) {
        console.error("Error sending booking email:", error);
        if (res) {
        }
    }
}


exports.cancelBooking = (req, res) => {
    const { bookingId } = req.params;
    const { bookingTime } = req.body;

    console.log("🚀 Incoming cancel request:", bookingId, "Booking Time:", bookingTime);

    if (!bookingId) {
        return res.status(400).json({ error: 'Booking ID is required' });
    }

    const getBookingQuery = `SELECT * FROM bookings WHERE bookingId = ?`;
    conn.query(getBookingQuery, [bookingId], (err, results) => {
        if (err) {
            console.error('❌ Error fetching booking details:', err);
            return res.status(500).json({ error: 'Failed to fetch booking details' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const bookingDetails = results[0];

        if (bookingDetails.orderStatus === 'Cancelled') {
            return res.status(400).json({ error: 'Booking already Cancelled' });
        }

        const userEmail = bookingDetails.email;
        // ✅ FIX #1: Safe JSON parsing with error handling
        let orderData, billingDetails, paymentDetails;
        try {
            orderData = JSON.parse(bookingDetails.orderData);
            billingDetails = JSON.parse(bookingDetails.billingDetails);
            paymentDetails = JSON.parse(bookingDetails.paymentdetails);
            billingContact = JSON.parse(bookingDetails.billingContact)
        } catch (parseError) {
            console.error('❌ Failed to parse booking data:', parseError);
            return res.status(500).json({ error: 'Invalid booking data format' });
        }

        const { pickUpDate, pickUpTime, passengerDetails } = {
            pickUpDate: orderData?.pickUpDate,
            pickUpTime: orderData?.pickUpTime,
            passengerDetails: orderData?.passengerDetails,
        };

        if (!pickUpDate || !pickUpTime) {
            console.error("❌ Missing pickUpDate or pickUpTime in orderData");
            return res.status(500).json({ error: 'Incomplete order data (missing date/time)' });
        }
            const firstName = bookingDetails.firstName
            const lastName =  bookingDetails.lastName
            const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            console.log(pickUpDate, "date")
            console.log(pickUpTime, "time")

        // ✅ FIX #3: Safer formatting of date and time
            try { 
                function parseDate(input) {
                    if (!input) return null;
            
                    if (input instanceof Date) return input;
            
                    if (typeof input === "string") {
                        // If format is like "2025-05-17 11:57:28", convert to ISO format by replacing space with 'T'
                        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(input)) {
                            return new Date(input.replace(" ", "T"));
                        }
                        // Else try normal Date parse (e.g. ISO with T and Z)
                        return new Date(input);
                    }
            
                    return new Date(input);
                }

                const normalizedPickUpDate = parseDate(pickUpDate);
                const normalizedPickUpTime = parseDate(pickUpTime);

                if (!normalizedPickUpDate || !normalizedPickUpTime) {
                    console.error("Missing or invalid pickUpDate or pickUpTime in combinedData.");
                    return;
                }

                // Use your existing formatting logic on normalized date/time
                const dateParts = normalizedPickUpDate.toString().split(" ");
                const monthMap = {
                    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
                    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
                };
                
                const formattedDate = `${monthMap[dateParts[1]]}/${dateParts[2]}/${dateParts[3]}`;
                console.log(formattedDate, "formatted date");
                
                const timeStr = normalizedPickUpTime.toString().split(" ")[4]; // "HH:MM:SS"
                const [hourStr, minuteStr] = timeStr.split(":");
                let hour = parseInt(hourStr, 10);
                const ampm = hour >= 12 ? "PM" : "AM";
                hour = hour % 12 || 12;
                
                const formattedTime = `${hour}:${minuteStr} ${ampm}`;

            const formattedPickUpDateTime = `${formattedDate} ${formattedTime}`;
            console.log("✅ Formatted Pickup DateTime:", formattedPickUpDateTime);

            // ✅ FIX #4: Safely access passenger email
            const primaryPassenger = passengerDetails?.passengers?.[0];
            const passengerEmail = primaryPassenger?.email || null;
            const recipients = passengerEmail && passengerEmail !== userEmail
                ? `${userEmail},${passengerEmail}`
                : userEmail;

            const cancelQuery = `UPDATE bookings SET orderStatus = 'Cancelled' WHERE bookingId = ?`;
            conn.query(cancelQuery, [bookingId], (err, results) => {
                if (err) {
                    console.error('❌ Error cancelling booking:', err);
                    return res.status(500).json({ error: 'Failed to cancel booking' });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Booking not found' });
                }

                // ✅ Respond immediately to frontend
                res.status(200).json({ message: 'Booking cancelled successfully', bookingId });

                // ✅ Send cancellation email in background (after response)
                try {
                    const emailBody = cancellationTemplate(
                        bookingId,
                        userEmail,
                        formattedPickUpDateTime,
                        bookingDetails.firstName,
                        bookingDetails.lastName,
                        bookingTime
                    );
                    const adminEmailBody = generateAdminBookingCancelEmail({
                        bookingId,
                        firstName: bookingDetails.firstName,
                        lastName: bookingDetails.lastName,
                        email: bookingDetails.email,
                        phone: bookingDetails.phone,
                        combinedData: orderData,
                        paymentDetails: paymentDetails,
                        formattedTime,
                        bookingTime,
                        billingContact
                    });
    
    
                    const mailOptions = {
                        from: process.env.SMTP_USER,
                        to: recipients,
                        subject: `Ride Cancellation: Reservation #${bookingId}_${capitalize(firstName)} ${capitalize(lastName)} [${formattedPickUpDateTime}]`,
                        html: emailBody
                    };

                    const mailOptionsAdmin = {
                        from: process.env.SMTP_USER,
                       // to: 'bipinlongjam11@gmail.com',
                        to: ["bipinlongjam11@gmail.com", "fax@bostonasapcoach.com"],
                        subject: `Ride Cancellation: Reservation #${bookingId}_${capitalize(firstName)} ${capitalize(lastName)} [${formattedPickUpDateTime}]`,
                        html: adminEmailBody
                    };

                    transporter.sendMail(mailOptions, (error) => {
                        if (error) console.error('❌ Error sending cancellation email:', error);
                        else console.log("✅ Cancellation email sent to:", recipients);
                    });

                    transporter.sendMail(mailOptionsAdmin, (error) => {
                        if (error) console.error('❌ Error sending admin email:', error);
                        else console.log("✅ Admin notification sent");
                    });

                } catch (emailError) {
                    console.error("❌ Unexpected error during email sending:", emailError);
                }
            });

        } catch (formatError) {
            console.error("❌ Error formatting date/time:", formatError);
            return res.status(500).json({ error: 'Internal formatting error' });
        }
    });
};


exports.getBookingById = (req, res) => {
    const { bookingId } = req.params;

    // Ensure that bookingId is provided
    if (!bookingId) {
        return res.status(400).json({ error: 'Booking ID is required' });
    }

    // Query to fetch booking details by bookingId
    const query = 'SELECT * FROM bookings WHERE bookingId = ?';

    conn.query(query, [bookingId], (err, results) => {
        if (err) {
            console.error('Error fetching booking by bookingId:', err);
            return res.status(500).json({ error: 'Failed to fetch booking details' });
        }

        // Check if the booking exists
        if (results.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // // Return the booking details
        // const booking = results[0];
        // res.status(200).json({ message: 'Booking fetched successfully', booking });
        res.status(200).json({ message: 'Booking fetched successfully', bookings: results });
    });
};

exports.updateBooking = (req, res) => {
    const { bookingId } = req.params;
    const {
        account_number,
        combinedData,
        returnService,
        paymentDetails,
        userType,
        bookActionType,
        bookingTime,
        firstName,
        lastName,
        email,
        phone
    } = req.body;

    if (!bookingId) {
        return res.status(400).json({ error: "Booking ID is required for updating the booking." });
    }

    const fetchQuery = `
        SELECT 
            firstName, lastName, email, phone, billingContact, account_number 
        FROM bookings 
        WHERE bookingId = ?
    `;

    conn.query(fetchQuery, [bookingId], (fetchErr, fetchResults) => {
        if (fetchErr) {
            console.error("Error fetching existing booking:", fetchErr);
            return res.status(500).json({ error: "Failed to fetch existing booking data." });
        }

        if (fetchResults.length === 0) {
            return res.status(404).json({ error: "Booking not found." });
        }

        const {
            firstName: existingFirstName,
            lastName: existingLastName,
            email: existingEmail,
            phone: existingPhone,
            billingContact,
            account_number: existingAccountNumber
        } = fetchResults[0];

        const finalFirstName = firstName || existingFirstName;
        const finalLastName = lastName || existingLastName;
        const finalEmail = email || existingEmail;
        const finalPhone = phone || existingPhone;
        const finalAccountNumber = account_number || existingAccountNumber;

        const updateQuery = `
            UPDATE bookings
            SET 
                firstName = ?,
                lastName = ?,
                email = ?,
                phone = ?,
                account_number = ?,
                orderData = ?,
                returnService = ?,
                paymentdetails = ?,
                userType = ?,
                bookActionType = ?,
                updatedAt = NOW()
            WHERE bookingId = ?
        `;

        conn.query(updateQuery, [
            finalFirstName,
            finalLastName,
            finalEmail,
            finalPhone,
            finalAccountNumber,
            JSON.stringify(combinedData),
            JSON.stringify(returnService),
            JSON.stringify(paymentDetails),
            userType,
            bookActionType,
            bookingId
        ], (err, results) => {
            if (err) {
                console.error("Error updating booking:", err);
                return res.status(500).json({ error: "Failed to update booking." });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "Booking not found or no changes were made." });
            }

            res.status(200).json({ message: "Booking updated successfully." });

            // Send confirmation emails
            try {
                const parsedBillingContact = JSON.parse(billingContact || '{}');
                const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

                const parseDate = (input) => {
                    if (!input) return null;
                    if (input instanceof Date) return input;
                    if (typeof input === "string" && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(input)) {
                        return new Date(input.replace(" ", "T"));
                    }
                    return new Date(input);
                };

                const normalizedPickUpDate = parseDate(combinedData?.pickUpDate);
                const normalizedPickUpTime = parseDate(combinedData?.pickUpTime);

                if (!normalizedPickUpDate || !normalizedPickUpTime) {
                    console.error("Invalid pickup date/time");
                    return;
                }

                const monthMap = {
                    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
                    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
                };
                const dateParts = normalizedPickUpDate.toString().split(" ");
                const formattedDate = `${monthMap[dateParts[1]]}/${dateParts[2]}/${dateParts[3]}`;

                const timeStr = normalizedPickUpTime.toString().split(" ")[4]; // HH:MM:SS
                const [hourStr, minuteStr] = timeStr.split(":");
                let hour = parseInt(hourStr, 10);
                const ampm = hour >= 12 ? "PM" : "AM";
                hour = hour % 12 || 12;
                const formattedTime = `${hour}:${minuteStr} ${ampm}`;

                const emailBody = generateBookingModificationEmail({
                    bookingId,
                    firstName: finalFirstName,
                    lastName: finalLastName,
                    account_number: finalAccountNumber,
                    email: finalEmail,
                    phone: finalPhone,
                    combinedData,
                    returnService,
                    paymentdetails: paymentDetails,
                    bookActionType,
                    bookingTime
                });

                const adminEmailBody = generateAdminBookingModificationEmail({
                    bookingId,
                    firstName: finalFirstName,
                    lastName: finalLastName,
                    account_number: finalAccountNumber,
                    email: finalEmail,
                    phone: finalPhone,
                    combinedData,
                    returnService,
                    paymentDetails: paymentDetails,
                    bookActionType,
                    formattedTime,
                    bookingTime,
                    billingContact: parsedBillingContact
                });

                const mailOptions = {
                    from: process.env.SMTP_USER,
                    to: finalEmail,
                    subject: `Ride Modification: Reservation #${bookingId}_${capitalize(finalFirstName)} ${capitalize(finalLastName)} - [${formattedDate} ${formattedTime}]`,
                    html: emailBody
                };

                const mailOptionsAdmin = {
                    from: process.env.SMTP_USER,
                   // to: 'bipin.xelogic@gmail.com',
                    to: ["bipinlongjam11@gmail.com", "fax@bostonasapcoach.com"],
                    subject: `Ride Modification: Reservation #${bookingId}_${capitalize(finalFirstName)} ${capitalize(finalLastName)} - [${formattedDate} ${formattedTime}]`,
                    html: adminEmailBody,
                };

                Promise.all([
                    transporter.sendMail(mailOptions),
                    transporter.sendMail(mailOptionsAdmin)
                ]).then(([custRes, adminRes]) => {
                    console.log("Customer email sent:", custRes.response);
                    console.log("Admin email sent:", adminRes.response);
                }).catch(emailErr => {
                    console.error("Email sending failed:", emailErr);
                });

            } catch (emailErr) {
                console.error("Email processing error:", emailErr);
            }
        });
    });
};

