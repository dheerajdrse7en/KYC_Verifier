const Kyc = require('../models/KYC');

exports.submitKYC = async (req, res) => {
  try {
    const {
      name,
      pan,
      aadhar,
      dob,
      address,
      mobile,
      email,
      fund,
      nomineeName,
      nomineeRelation,
      bankName,
      ifsc,
      accountNumber,
      photoBase64
    } = req.body;

    const newKyc = new Kyc({
      name,
      pan,
      aadhar,
      dob,
      address,
      mobile,
      email,
      fund,
      nomineeName,
      nomineeRelation,
      bankName,
      ifsc,
      accountNumber,
      photoBase64
    });

    await newKyc.save();
    res.status(201).json({ message: 'KYC data saved successfully' });
  } catch (error) {
    console.error('KYC Save Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
