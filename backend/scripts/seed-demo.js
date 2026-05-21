require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/User');
const BoardGame = require('../models/Boardgame');

const DEMO_GAMES = [
  {
    title: 'Catan',
    description: 'Trade, build, and settle the island of Catan.',
    category: 'Strategy',
    rentalPrice: 8,
    quantity: 3,
    minPlayers: 3,
    maxPlayers: 4,
    playTime: 90,
    difficulty: 'Medium'
  },
  {
    title: 'Ticket to Ride',
    description: 'Collect train cards and claim railway routes across the map.',
    category: 'Family',
    rentalPrice: 7,
    quantity: 2,
    minPlayers: 2,
    maxPlayers: 5,
    playTime: 60,
    difficulty: 'Easy'
  },
  {
    title: 'Codenames',
    description: 'Give one-word clues to help your team find secret agents.',
    category: 'Party',
    rentalPrice: 5,
    quantity: 4,
    minPlayers: 4,
    maxPlayers: 8,
    playTime: 25,
    difficulty: 'Easy'
  },
  {
    title: 'Pandemic',
    description: 'Cooperate to stop global outbreaks and find cures.',
    category: 'Cooperative',
    rentalPrice: 9,
    quantity: 2,
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 45,
    difficulty: 'Hard'
  }
];

const upsertUser = async ({ fullName, email, password, role }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });

  if (existing) {
    existing.role = role;
    existing.fullName = fullName;
    existing.username = normalizedEmail;
    await existing.save();
    console.log(`Updated user: ${normalizedEmail} (${role})`);
    return existing;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    username: normalizedEmail,
    email: normalizedEmail,
    password: hashedPassword,
    role
  });

  console.log(`Created user: ${normalizedEmail} (${role})`);
  return user;
};

const seedGames = async () => {
  const count = await BoardGame.countDocuments();

  if (count >= DEMO_GAMES.length) {
    console.log(`Skipping games seed (${count} games already in DB)`);
    return;
  }

  for (const game of DEMO_GAMES) {
    const exists = await BoardGame.findOne({ title: game.title });

    if (exists) {
      continue;
    }

    await BoardGame.create({
      ...game,
      availableQuantity: game.quantity,
      status: 'Available'
    });

    console.log(`Created game: ${game.title}`);
  }
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');

    await upsertUser({
      fullName: 'Demo Admin',
      email: 'admin@demo.com',
      password: 'demo1234',
      role: 'admin'
    });

    await upsertUser({
      fullName: 'Demo Customer',
      email: 'customer@demo.com',
      password: 'demo1234',
      role: 'customer'
    });

    await seedGames();

    console.log('\nDemo accounts:');
    console.log('  admin@demo.com / demo1234 (admin)');
    console.log('  customer@demo.com / demo1234 (customer)');

    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
