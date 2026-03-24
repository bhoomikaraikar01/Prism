require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');



const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
const authRoutes = require('./routes/auth.routes');
const reportRoutes = require('./routes/report.routes');
const waterRoutes = require('./routes/water.routes');
const { HDMC_WARDS, KARNATAKA_DISTRICTS } = require('./data/hubli-dharwad-wards');

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/water', waterRoutes);

// District & Ward Data Endpoints (public)
app.get('/api/districts', (req, res) => res.json(KARNATAKA_DISTRICTS));
app.get('/api/wards', (req, res) => {
  const district = req.query.district || 'hubli-dharwad';
  res.json(HDMC_WARDS.filter(w => w.id.startsWith('hdmc')));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CivicPulse API is running' });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("🚀 Connected to MongoDB Atlas"))
  .catch((err) => console.error(err));

// Start Background Services
require('./services/cron.service');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
