const conn = require('../services/db');
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer')
require('dotenv').config()
const generatePassengerTemplate   = require('../utils/passengerTemplate')


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,  
    port: process.env.SMTP_PORT,  
    secure: false,  
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});


exports.getUserDetails = async(req ,res) =>{
    try{
        const userId= req.params.id;

        if(!userId){
            return res.status(400).json({msg:'User ID is required'}); 
        }
            const [result] = await conn.promise().query(
                `Select * FROM user WHERE id = ?`,
                [userId]);
        if(result.length === 0){
            return res.status(404).json({msg:'User not found'});
        }
        return res.status(200).json({user: result[0]});
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({msg:'Internal server error'});
    }
}

exports.updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  
  if (!userId) {
    return res.status(400).json({ msg: 'User ID is required' });
  }

  try {
    // 1. Fetch current user data
    const [userResult] = await conn.promise().query(
      `SELECT * FROM user WHERE id = ?`,
      [userId]
    );
    
    if (userResult.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const currentUser = userResult[0];
    const updateFields = [];
    const updateValues = [];
    
    // 2. Handle password update with validation
    if (updateData.currentPassword || updateData.newPassword) {
      if (!updateData.currentPassword) {
        return res.status(400).json({ msg: 'Current password is required' });
      }
      
      if (!updateData.newPassword) {
        return res.status(400).json({ msg: 'New password is required' });
      }
      
      const isMatch = await bcrypt.compare(
        updateData.currentPassword, 
        currentUser.password
      );
      
      if (!isMatch) {
        return res.status(401).json({ msg: 'Current password is incorrect' });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updateData.newPassword, salt);
      
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }
    
    // 3. Handle top-level field updates
    const topLevelFields = [
      'prefix', 'firstname', 'lastname', 'email'
    ];
    
    topLevelFields.forEach(field => {
      if (updateData[field] !== undefined && 
          updateData[field] !== currentUser[field]) {
        updateFields.push(`${field} = ?`);
        updateValues.push(updateData[field]);
      }
    });
    
    // 4. Handle address updates
    if (updateData.saved_addresses) {
      let newAddress = {};
      
      try {
        // Parse existing address
        const currentAddress = typeof currentUser.saved_addresses === 'string'
          ? JSON.parse(currentUser.saved_addresses)
          : currentUser.saved_addresses || {};
        
        // Merge changes
        newAddress = {
          ...currentAddress,
          ...(typeof updateData.saved_addresses === 'string'
            ? JSON.parse(updateData.saved_addresses)
            : updateData.saved_addresses)
        };
        
        updateFields.push('saved_addresses = ?');
        updateValues.push(JSON.stringify(newAddress));
      } catch (error) {
        console.error('Error parsing address:', error);
        return res.status(400).json({ msg: 'Invalid address format' });
      }
    }
    
    // 5. Handle company information updates
    if (updateData.contact_information) {
      let newContactInfo = {};

      try {
        const currentContact = typeof currentUser.contact_information === 'string'
          ? JSON.parse(currentUser.contact_information)
          : currentUser.contact_information || {};

        newContactInfo = {
          ...currentContact,
          ...(typeof updateData.contact_information === 'string'
            ? JSON.parse(updateData.contact_information)
            : updateData.contact_information)
        };

        updateFields.push('contact_information = ?');
        updateValues.push(JSON.stringify(newContactInfo));
      } catch (error) {
        console.error('Error parsing contact information:', error);
        return res.status(400).json({ msg: 'Invalid contact information format' });
      }
    }

    
    // 6. Execute update if there are changes
    if (updateFields.length === 0) {
      return res.status(200).json({ 
        msg: 'No changes detected',
        user: currentUser
      });
    }
    
    // Build final query
    updateValues.push(userId);
    const query = `
      UPDATE user 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `;
    
    await conn.promise().query(query, updateValues);
    
    // 7. Fetch and return updated user
    const [updatedResult] = await conn.promise().query(
      `SELECT * FROM user WHERE id = ?`,
      [userId]
    );
    
    return res.status(200).json({ user: updatedResult[0] });
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.addPassenger = async (req, res) => {
  const userId = req.params.id;
  const newPassenger = req.body;
  const isAdmin = req.isAdmin || false; // Add this flag from your auth middleware
 
  if (!userId) {
    return res.status(400).json({ msg: "User ID is required" });
  }
 
  try {
    // Step 1: Get current passengers
    const [result] = await conn.promise().query(
      `SELECT passengers FROM user WHERE id = ?`,
      [userId]
    );
 
    if (result.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }
 
    let passengers = {};
 
    if (result[0].passengers) {
      try {
        passengers = typeof result[0].passengers === "string"
          ? JSON.parse(result[0].passengers)
          : result[0].passengers;
      } catch (err) {
        console.error("Error parsing passengers:", err);
        return res.status(400).json({ msg: "Invalid passengers format in DB" });
      }
    }
 
    // Step 2: Generate unique profile number and key
    const existingProfileNumbers = new Set();
    const existingKeys = new Set(Object.keys(passengers));
 
    // Collect all existing profile numbers to avoid duplicates
    Object.values(passengers).forEach(passenger => {
      if (passenger.profileNumber) {
        existingProfileNumbers.add(passenger.profileNumber);
      }
    });
 
    let profileNumber;
    let passengerKey;
 
    // Generate unique 6-digit profile number (1000101, 1000102, etc.)
    for (let i = 1; i <= 99; i++) {
      const candidate = `10001${i.toString().padStart(2, "0")}`;
      if (!existingProfileNumbers.has(candidate)) {
        profileNumber = candidate;
        passengerKey = i.toString().padStart(2, "0"); // Use "01", "02" as keys consistently
        break;
      }
    }
 
    if (!profileNumber || !passengerKey) {
      return res.status(400).json({ msg: "Maximum number of passengers reached (99)" });
    }
 
    // Step 3: Check if key already exists (additional safety)
    if (existingKeys.has(passengerKey)) {
      return res.status(400).json({ msg: "Passenger key already exists. Please try again." });
    }
 
    // Step 4: Add new passenger with consistent structure
    passengers[passengerKey] = {
      prefix: newPassenger.prefix || "Mr",
      firstname: newPassenger.firstname || "",
      middlename: newPassenger.middlename || "",
      lastname: newPassenger.lastname || "",
      email: newPassenger.email || "",
      phone: newPassenger.phone || "",
      receiveNotifications: newPassenger.receiveNotifications || false,
      contact: newPassenger.contact || "Passenger",
      type: newPassenger.type || "Passenger",
      profileNumber: profileNumber, // Full 7-digit number
      status: "active",
      linkedCardId: newPassenger.linkedCardId || null
    };
 
    // Step 5: Save back to DB
    await conn.promise().query(
      `UPDATE user SET passengers = ? WHERE id = ?`,
      [JSON.stringify(passengers), userId]
    );
 
    return res.status(200).json({
      msg: "Passenger added successfully",
      profileNumber: profileNumber,
      passengerKey: passengerKey,
      passengers
    });
 
  } catch (error) {
    console.error("Error adding passenger:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.getPassengerDetails = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  try {
    const [result] = await conn.promise().query(
      `SELECT id, passengers, account_number FROM user WHERE id = ?`,
      [userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    let passengers = {};

    if (result[0].passengers) {
      try {
        passengers =
          typeof result[0].passengers === "string"
            ? JSON.parse(result[0].passengers)
            : result[0].passengers;
      } catch (err) {
        console.error("Error parsing passengers", err);
        return res.status(400).json({ msg: "Invalid passenger format in DB" });
      }
    }

    return res.status(200).json({
      id: result[0].id,                // 👈 return id here
      account_number: result[0].account_number,
      passengers,
    });
  } catch (error) {
    console.error("Error fetching passenger details", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};


exports.editPassengers = async (req, res) => {
  const { userId, profileNumber } = req.params;
  const updatedPassenger = req.body;
  console.log(updatedPassenger, "updated passenger data")

  if (!userId || !profileNumber || !updatedPassenger) {
    return res.status(400).json({ msg: "User ID, profileNumber, and updatedPassenger data are required." });
  }

  try {
    // Fetch passengers
    const [result] = await conn.promise().query(
      `SELECT passengers FROM user WHERE id = ?`,
      [userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Parse passengers like in sendUserDetailEmail
    let passengers;
    const passengersData = result[0].passengers;

    if (typeof passengersData === "string") {
      try {
        passengers = JSON.parse(passengersData);
      } catch (parseError) {
        console.error("Error parsing passengers JSON:", parseError);
        return res.status(400).json({ msg: "Invalid passengers format in DB" });
      }
    } else if (typeof passengersData === "object" && passengersData !== null) {
      passengers = passengersData;
    } else {
      passengers = {};
    }

    if (!passengers[profileNumber]) {
      return res.status(404).json({ msg: "Passenger not found" });
    }

    // ✅ Allowed fields to prevent unexpected data breaking JSON
    const allowedFields = [
      "prefix",
      "firstname",
      "middlename",
      "lastname",
      "email",
      "phone",
      "receiveNotifications",
      "contact",
      "status",
      "type", 
      "linkedCardId"  
    ];

    // Sanitize update
    const sanitizedPassenger = {};
    allowedFields.forEach((key) => {
      if (updatedPassenger[key] !== undefined) {
        sanitizedPassenger[key] = updatedPassenger[key];
      }
    });

    // Merge into existing passenger
    passengers[profileNumber] = {
      ...passengers[profileNumber],
      ...sanitizedPassenger,
    };

    // Save back to DB
    await conn.promise().query(
      `UPDATE user SET passengers = ? WHERE id = ?`,
      [JSON.stringify(passengers), userId]
    );

    return res.status(200).json({
      msg: "Passenger updated successfully",
      passengers,
    });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};


exports.deletePassengerByProfile = async (req, res) => {
  const { userId, profileNumber } = req.params;

  try {
    const [rows] = await conn.promise().query(
      "SELECT passengers FROM user WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    let passengers = {};
    if (rows[0].passengers) {
      try {
        passengers = typeof rows[0].passengers === "string"
          ? JSON.parse(rows[0].passengers)
          : rows[0].passengers;
      } catch (err) {
        return res.status(400).json({ msg: "Invalid passengers format in DB" });
      }
    }

    if (!passengers[profileNumber]) {
      return res.status(404).json({ msg: "Passenger not found" });
    }

    delete passengers[profileNumber];

    await conn.promise().query(
      "UPDATE user SET passengers = ? WHERE id = ?",
      [JSON.stringify(passengers), userId]
    );

    res.status(200).json({ msg: "Passenger deleted successfully", passengers });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// controller.js
exports.updatePassengerStatus = async (req, res) => {
  const { userId, profileNumber } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ msg: "Status is required" });
  }

  try {
    // 1. Fetch passengers from user table
    const [rows] = await conn.promise().query(
      "SELECT passengers FROM user WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 2. Parse passengers safely
    let passengers = {};
    if (rows[0].passengers) {
      try {
        passengers = typeof rows[0].passengers === "string"
          ? JSON.parse(rows[0].passengers)
          : rows[0].passengers;
      } catch (err) {
        return res.status(400).json({ msg: "Invalid passengers format in DB" });
      }
    }

    // 3. Check if passenger exists
    if (!passengers[profileNumber]) {
      return res.status(404).json({ msg: "Passenger not found" });
    }

    // 4. Update passenger status
    passengers[profileNumber].status = status;

    // 5. Save back to DB
    await conn.promise().query(
      "UPDATE user SET passengers = ? WHERE id = ?",
      [JSON.stringify(passengers), userId]
    );

    res.status(200).json({
      msg: `Passenger status updated to "${status}" successfully`,
      updatedPassenger: passengers[profileNumber],
      passengers
    });
  } catch (err) {
    console.error("Error updating passenger status:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};


exports.getContactInformation = async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await conn.promise().query(
      "SELECT contact_information FROM user WHERE id = ?",
      [userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    let contactInfo = [];

    // Safely parse if it's JSON, otherwise default to []
    if (result[0].contact_information) {
      try {
        const parsed = JSON.parse(result[0].contact_information);
        contactInfo = Array.isArray(parsed)
          ? parsed
          : Object.keys(parsed).map((type, idx) => ({
              id: idx + 1,
              type,
              value: parsed[type] || "",
            }));
      } catch {
        contactInfo = [];
      }
    }

    return res.status(200).json({ contact_information: contactInfo });
  } catch (error) {
    console.error("Error fetching contact information:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.addOrUpdateContactInformation = async (req, res) => {
  const userId = req.params.id;
  const { id, type, value } = req.body; // id is optional for adding

  if (!type || value === undefined) {
    return res.status(400).json({ msg: "Type and value are required" });
  }

  try {
    const [result] = await conn.promise().query(
      "SELECT contact_information FROM user WHERE id = ?",
      [userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    let contactInfo = typeof result[0].contact_information === "string"
      ? JSON.parse(result[0].contact_information || "[]")
      : result[0].contact_information || [];

    if (!Array.isArray(contactInfo)) {
      contactInfo = [];
    }

    if (id) {
      // Update existing
      contactInfo = contactInfo.map(c =>
        c.id === id ? { ...c, type, value } : c
      );
    } else {
      // Add new with auto-increment id
      const newId = contactInfo.length > 0 ? Math.max(...contactInfo.map(c => c.id)) + 1 : 1;
      contactInfo.push({ id: newId, type, value });
    }

    await conn.promise().query(
      "UPDATE user SET contact_information = ? WHERE id = ?",
      [JSON.stringify(contactInfo), userId]
    );

    return res.status(200).json({ msg: "Contact info saved", contact_information: contactInfo });
  } catch (error) {
    console.error("Error updating contact information:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.deleteContactInformation = async (req, res) => {
  const userId = req.params.id;
  const contactId = parseInt(req.params.contactId, 10);

  if (!contactId) {
    return res.status(400).json({ msg: "Contact ID is required" });
  }

  try {
    const [result] = await conn.promise().query(
      "SELECT contact_information FROM user WHERE id = ?",
      [userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    let contactInfo = typeof result[0].contact_information === "string"
      ? JSON.parse(result[0].contact_information || "[]")
      : result[0].contact_information || [];

    if (!Array.isArray(contactInfo)) {
      contactInfo = [];
    }

    const updated = contactInfo.filter(c => c.id !== contactId);

    await conn.promise().query(
      "UPDATE user SET contact_information = ? WHERE id = ?",
      [JSON.stringify(updated), userId]
    );

    return res.status(200).json({ msg: "Contact deleted", contact_information: updated });
  } catch (error) {
    console.error("Error deleting contact information:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};


exports.sendUserDetailEmail = async (req, res) => {
  const { userId, profileNumber } = req.params;

  try {
    const [rows] = await conn
      .promise()
      .query("SELECT passengers FROM user WHERE id = ?", [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // const passengers = JSON.parse(rows[0].passengers || "{}");
    let passengers;
    const passengersData = rows[0].passengers;
    
    if (typeof passengersData === 'string') {
      try {
        passengers = JSON.parse(passengersData);
      } catch (parseError) {
        console.error("Error parsing passengers JSON:", parseError);
        return res.status(400).json({ msg: "Invalid passenger data format" });
      }
    } else if (typeof passengersData === 'object' && passengersData !== null) {
      passengers = passengersData;
    } else {
      passengers = {};
    }
    const passenger = passengers[profileNumber];

    if (!passenger) {
      return res.status(404).json({ msg: "Passenger not found" });
    }

    const { passengerTemplate } = generatePassengerTemplate({
      profileNumber: passenger.profileNumber,
      firstname: passenger.firstname,
      middlename: passenger.middlename,
      lastname: passenger.lastname,
      email: passenger.email,
      phone: passenger.phone,
      status: passenger.status,
    });

    // respond immediately (non-blocking)
    res.status(200).json({ msg: "Email queued successfully" });

    // send email in background
    transporter.sendMail({
      from: `"Your App" <${process.env.SMTP_USER}>`,
      to: passenger.email,
      subject: "Your Passenger Details",
      html: passengerTemplate,
    }).then(info => {
      console.log("Email sent:", info.messageId);
    }).catch(err => {
      console.error("Email sending failed:", err);
    });

  } catch (error) {
    console.error("Error preparing passenger details email", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};


