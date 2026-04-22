const conn = require('../services/db')
require("dotenv").config();
const { validationResult } = require("express-validator");
const generateSafeTwoDigitId = require('../helpers/cardHelpers')

 exports.getSavedAddresses = async (req, res) =>{
    try{
        const userId = req.params.id;
        if(!userId){
            return res.status(400).json({msg:'User ID is requiresd'});
        }
        const [rows] = await conn.promise().query('SELECT saved_addresses FROM user where id = ?', [userId])
        if(rows.length === 0){
            return res.status(404).json({msg:'User not founr'});
        }
        let savedAddress = [];
        try{
            savedAddress = rows[0].saved_addresses ? JSON.parse(rows[0].saved_addresses) : [];
        }
        catch(err){
            console.error('Error parsing saved_addresses:',err);
            return res.status(500).json({msg:'Failed to parse saved addresses'});
        }
        return res.status(200).json({ savedAddresses: savedAddress });
    } catch (error) {
        console.error('Error fetching saved addresses:', error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

exports.addAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const newAddress = req.body; // { street, city, zip, ... }

    const [rows] = await conn
      .promise()
      .query('SELECT saved_addresses FROM user WHERE id = ?', [userId]);

    let addresses = [];

    if (rows.length && rows[0].saved_addresses) {
      try {
        const parsed = JSON.parse(rows[0].saved_addresses);
        addresses = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        console.error('Error parsing saved_addresses:', e);
      }
    }

    const existingIds = addresses.map((a) => a.id);
    const newId = generateSafeTwoDigitId(existingIds);

    addresses.push({ id: newId, ...newAddress });

    await conn
      .promise()
      .query('UPDATE user SET saved_addresses = ? WHERE id = ?', [
        JSON.stringify(addresses),
        userId,
      ]);

    res.status(201).json({ status: 'success', msg: 'Address added', id: newId });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.editAddress = async (req, res) => {
  try {
    const { userId, id } = req.params;
    const updatedData = req.body;

    const [rows] = await conn
      .promise()
      .query('SELECT saved_addresses FROM user WHERE id = ?', [userId]);

    let addresses = [];

    if (rows.length && rows[0].saved_addresses) {
      try {
        const parsed = JSON.parse(rows[0].saved_addresses);

        // Convert object → array & filter valid addresses
        addresses = Array.isArray(parsed)
          ? parsed
          : Object.values(parsed).filter(
              (item) => typeof item === 'object' && item?.id
            );
      } catch (e) {
        console.error('Error parsing saved_addresses:', e);
      }
    }

    const index = addresses.findIndex((a) => String(a.id) === String(id));
    if (index === -1) {
      return res.status(404).json({ msg: 'Address not found' });
    }

    addresses[index] = { ...addresses[index], ...updatedData };

    await conn
      .promise()
      .query('UPDATE user SET saved_addresses = ? WHERE id = ?', [
        JSON.stringify(addresses),
        userId,
      ]);

    res.status(200).json({ status: 'success', msg: 'Address updated' });
  } catch (error) {
    console.error('Edit address error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};



exports.deleteAddress = async (req, res) => {
  try {
    const { userId, id } = req.params;

    const [rows] = await conn
      .promise()
      .query('SELECT saved_addresses FROM user WHERE id = ?', [userId]);

    let addresses = [];
    if (rows.length && rows[0].saved_addresses) {
      try {
        const parsed = JSON.parse(rows[0].saved_addresses);
        addresses = Object.values(parsed).filter(
          (item) => typeof item === 'object' && item?.id
        );
      } catch (e) {
        console.error('Error parsing saved_addresses:', e);
      }
    }

    const updatedAddresses = addresses.filter(
      (a) => String(a.id) !== String(id)
    );

    if (updatedAddresses.length === addresses.length) {
      return res.status(404).json({ msg: 'Address not found' });
    }

    await conn
      .promise()
      .query('UPDATE user SET saved_addresses = ? WHERE id = ?', [
        JSON.stringify(updatedAddresses),
        userId,
      ]);

    res.status(200).json({ status: 'success', msg: 'Address deleted' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

