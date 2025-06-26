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

mongoose.connect('mongodb+srv://Dheeraj:Ronaldocr7@cluster0.bcyxe0y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', kycRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
