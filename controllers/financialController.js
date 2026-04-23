const conn = require('../services/db');
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require('nodemailer');
const generateSafeTwoDigitId = require('../helpers/cardHelpers');

exports.getSavedCards = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }

    const [rows] = await conn.promise().query(
      `SELECT saved_cards FROM user WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    let savedCards = [];

    try {
      savedCards = rows[0].saved_cards ? JSON.parse(rows[0].saved_cards) : [];

      savedCards.sort((a, b) => (b.preferred === true ) - (a.preferred === true));
    } catch (err) {
      console.error('Error parsing saved_cards:', err);
      return res.status(500).json({ msg: 'Failed to parse saved cards' });
    }

    res.status(200).json({
      status: 'success',
      savedCards
    });

  } catch (error) {
    console.error('Error fetching saved cards:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.addCard = async (req, res) => {
  try {
    const userId = req.params.id;
    const incomingCard = req.body;

    if (!userId || !incomingCard || Object.keys(incomingCard).length === 0) {
      return res.status(400).json({ msg: 'User ID and card data are required' });
    }

    const [rows] = await conn.promise().query(`SELECT saved_cards FROM user WHERE id = ?`, [userId]);

    if (rows.length === 0) return res.status(404).json({ msg: 'User not found' });

    let savedCards = [];
    try {
      savedCards = rows[0].saved_cards ? JSON.parse(rows[0].saved_cards) : [];
    } catch (err) {
      savedCards = [];
    }

    // Check for duplicate based on card number + expiry
    const isDuplicate = savedCards.some(card =>
      card.cardNumber === incomingCard.cardNumber &&
      card.expirationMonth === incomingCard.expirationMonth &&
      card.expirationYear === incomingCard.expirationYear
    );

    if (isDuplicate) return res.status(409).json({ msg: 'Card already exists' });

    const existingIds = savedCards.map(card => card.id);
    const newId = generateSafeTwoDigitId(existingIds);

    // Ignore incoming ID and use our own
    const finalCard = {
      id: newId,
      ...incomingCard
    };

    if(finalCard.preferred){
        savedCards = savedCards.map(card =>({...card, preferred: false})); 
    }
    savedCards.push(finalCard);

    await conn.promise().query(
      `UPDATE user SET saved_cards = ? WHERE id = ?`,
      [JSON.stringify(savedCards), userId]
    );

   res.status(200).json({
    status: 'success',  
    msg: 'Card added successfully',
    savedCards
    });

  } catch (err) {
    console.error('Add card error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cardId = req.params.cardId;

    if (!userId || !cardId) {
      return res.status(400).json({ msg: 'User ID and Card ID are required' });
    }

    const [rows] = await conn.promise().query(`SELECT saved_cards FROM user WHERE id = ?`, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    let savedCards = [];
    try {
      savedCards = rows[0].saved_cards ? JSON.parse(rows[0].saved_cards) : [];
    } catch (err) {
      return res.status(500).json({ msg: 'Failed to parse saved cards' });
    }

    const updatedCards = savedCards.filter(card => String(card.id) !== String(cardId));

    if (updatedCards.length === savedCards.length) {
      return res.status(404).json({ msg: 'Card not found' });
    }

    await conn.promise().query(
      `UPDATE user SET saved_cards = ? WHERE id = ?`,
      [JSON.stringify(updatedCards), userId]
    );

    res.status(200).json({ msg: 'Card deleted successfully', savedCards: updatedCards });

  } catch (err) {
    console.error('Delete card error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};


exports.editCard = async (req, res) => {
  try {
    const { userId, cardId } = req.params;
    const updatedCard = req.body;

    const [rows] = await conn.promise().query(`SELECT saved_cards FROM user WHERE id = ?`, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    let savedCards = [];
    try {
      savedCards = rows[0].saved_cards ? JSON.parse(rows[0].saved_cards) : [];
    } catch (err) {
      return res.status(500).json({ msg: 'Failed to parse saved cards' });
    }

    const cardIndex = savedCards.findIndex(card => String(card.id) === String(cardId));

    if (cardIndex === -1) {
      return res.status(404).json({ msg: 'Card not found' });
    }

    if(updatedCard.preferred){
        savedCards = savedCards.map(card =>({...card, preferred:false}))
    }

    savedCards[cardIndex] = { ...savedCards[cardIndex], ...updatedCard };

    await conn.promise().query(`UPDATE user SET saved_cards = ? WHERE id = ?`, [
      JSON.stringify(savedCards),
      userId,
    ]);

    res.status(200).json({ status: 'success', msg: 'Card updated successfully', savedCards });

  } catch (err) {
    console.error('Edit card error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
