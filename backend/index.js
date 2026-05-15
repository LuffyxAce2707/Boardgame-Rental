require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// ========================
// MIDDLEWARE
// ========================
app.use(express.json());
app.use(express.static('public'));

// ========================
// MODELS
// ========================
const User = require('./models/User');

// ========================
// MONGODB CONNECTION
// ========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err.message));

// ========================
// TEST ROUTE
// ========================
app.get('/', (req, res) => {
  res.send('API is running');
});

// ========================
// AUTH ROUTES
// ========================

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "SECRET_KEY");

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========================
// GAME ROUTES
// ========================
const gameRoutes = require('./routes/gameRoutes');
app.use('/api/games', gameRoutes);

// ========================
// RENTAL ROUTES
// ========================
const rentalRoutes = require('./routes/rentalRoutes');
app.use('/api/rentals', rentalRoutes);

// ========================
// START SERVER
// ========================
app.listen(5000, () => {
  console.log('🚀 Server running on port 5000');
});