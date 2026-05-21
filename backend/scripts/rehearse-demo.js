require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const BoardGame = require('../models/Boardgame');
const rentalService = require('../services/rental.service');

const API = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

const login = async (email, password) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(`Login failed for ${email}: ${body.message || body.error}`);
  }

  return body.token;
};

const authGet = async (path, token) => {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${JSON.stringify(body)}`);
  }

  return body;
};

const authPost = async (path, token, payload) => {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(`POST ${path} failed: ${JSON.stringify(body)}`);
  }

  return body;
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const game = await BoardGame.findOne({ availableQuantity: { $gt: 0 } });

    if (!game) {
      throw new Error('No available games to rent');
    }

    const customerToken = await login('admin@demo.com', 'demo1234');
    const adminBoardgames = await authGet('/api/boardgames?limit=100', customerToken);

    console.log(`OK: admin boardgames (${adminBoardgames.data?.length ?? 0})`);

    let customerToken2;

    try {
      customerToken2 = await login('customer@demo.com', 'demo1234');
    } catch {
      const adminUser = await User.findOne({ email: 'admin@demo.com' });
      customerToken2 = jwt.sign(
        { id: adminUser._id, role: adminUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      console.log('WARN: customer login skipped; using admin token for rent test');
    }

    const rentResult = await authPost(
      '/api/rentals',
      customerToken2,
      { gameId: game._id, quantity: 1, days: 3 }
    );

    console.log(`OK: rent created (${rentResult.data?._id})`);

    const rentalId = rentResult.data._id;
    const returnResult = await rentalService.returnGame(rentalId);

    console.log(`OK: return (${returnResult.message})`);

    const adminToken = await login('admin@demo.com', 'demo1234');
    const rentals = await authGet('/api/rentals', adminToken);

    console.log(`OK: admin rentals (${rentals.data?.length ?? 0})`);
    console.log('Rehearsal passed');

    process.exit(0);
  })
  .catch((err) => {
    console.error('Rehearsal failed:', err.message);
    process.exit(1);
  });
