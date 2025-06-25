// models/KYC.js
const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  name: String,
  pan: String,
  aadhar: String,
  dob: String,
  address: String,
  mobile: String,
  email: String,
  fund: String,
  nomineeName: String,
  nomineeRelation: String,
  bankName: String,
  ifsc: String,
  accountNumber: String,
  photoBase64: String // Can be a long Base64 string of the image
}, { timestamps: true });

module.exports = mongoose.model('Kyc', kycSchema);
