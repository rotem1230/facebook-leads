const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;
const authRoutes = require('./routes/auth');
const facebookRoutes = require('./routes/facebook');
const templatesRoutes = require('./routes/templates');
const keywordsRoutes = require('./routes/keywords');
const leadsRoutes = require('./routes/leads');
const businessRoutes = require('./routes/business');
const { createClient } = require('@supabase/supabase-js');

const app = express();

console.log('Initializing server...');

// Initialize Supabase
const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// Middleware
app.use(cors({
    origin: ['https://your-frontend-domain.com', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, req.body);
    next();
});

// Basic route for testing
app.get('/', (req, res) => {
    console.log('Root route hit');
    res.send('Server is running');
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// יצירת תיקיית data אם לא קיימת
const dataDir = path.join(process.cwd(), 'data');
fs.mkdir(dataDir, { recursive: true }).catch(console.error);

// Connect to MongoDB
mongoose.connect(config.mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/facebook', facebookRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/keywords', keywordsRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/business', businessRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
});

console.log('Server initialized');

module.exports = app; 