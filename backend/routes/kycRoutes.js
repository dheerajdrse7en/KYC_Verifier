// routes/kycRoutes.js
const express = require('express');
const router = express.Router();
const KYC = require('../models/kycModel');

// Submit KYC form
router.post('/submitKYC', async (req, res) => {
  try {
    const kycData = new KYC(req.body);
    await kycData.save();
    res.status(200).json({ message: 'KYC submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit KYC' });
  }
});

module.exports = router;
