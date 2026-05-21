require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const User = require('../models/User');

const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/promote-admin.js <email>');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const result = await User.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { role: 'admin' },
      { new: true }
    );

    if (!result) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }

    console.log(`Promoted ${result.email} to admin`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
