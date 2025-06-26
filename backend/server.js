const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const kycRoutes = require('./routes/kycRoutes');

const app = express();
const PORT = 3000;

// ✅ Fix: Allow large payloads for base64 image (up to 10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS config (unchanged)
app.use(cors({
  origin: 'https://kycdocupload.netlify.app',
  methods: ['GET', 'POST'],
  credentials: true
}));

// MongoDB connection (unchanged)
mongoose.connect('mongodb+srv://Dheeraj:Ronaldocr7@cluster0.bcyxe0y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', kycRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
