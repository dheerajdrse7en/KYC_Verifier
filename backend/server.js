const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const kycRoutes = require('./routes/kycRoutes');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'https://kycdocupload.netlify.app',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mutualfundkyc')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', kycRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
