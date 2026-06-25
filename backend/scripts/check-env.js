require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const required = ['MONGO_URI', 'JWT_SECRET'];
const optional = [
  'JWT_EXPIRES_IN',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'PORT',
  'API_BASE_URL'
];

let ok = true;

function describeMongoUri(uri) {
  const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)(?:([^@/?#]+)@)?([^/?#]+)(?:\/([^?#]*))?/i);

  if (!match) {
    console.error('Invalid MONGO_URI format');
    ok = false;
    return;
  }

  const [, scheme, auth, hosts, dbName = ''] = match;
  const username = auth ? decodeURIComponent(auth.split(':')[0]) : null;

  console.log(`Mongo target: ${scheme.replace('://', '')} ${hosts}`);
  console.log(`Mongo database: ${dbName || '(not specified)'}`);

  if (!auth) {
    console.warn('Warning: MONGO_URI has no username/password section.');
    return;
  }

  if (!username) {
    console.warn('Warning: MONGO_URI username is empty.');
  } else {
    console.log(`Mongo user: ${username}`);
  }

  if (!auth.includes(':') || auth.endsWith(':')) {
    console.warn('Warning: MONGO_URI password is missing or empty.');
  }
}

async function checkMongoConnection() {
  const mongoose = require('mongoose');

  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('OK: MongoDB connection succeeded');
  } catch (err) {
    ok = false;

    if (err.code === 8000 || err.codeName === 'AtlasError') {
      console.error('MongoDB authentication failed.');
      console.error('Check the Atlas database user password, authSource, and that the password in MONGO_URI is URL-encoded if it contains special characters.');
    } else {
      console.error(`MongoDB connection failed: ${err.message}`);
    }
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required env: ${key}`);
    ok = false;
  } else {
    console.log(`OK: ${key} is set`);
  }
}

for (const key of optional) {
  if (process.env[key]) {
    console.log(`OK: ${key} is set`);
  } else {
    console.log(`Optional (not set): ${key}`);
  }
}

if (process.env.MONGO_URI) {
  describeMongoUri(process.env.MONGO_URI);
}

if (process.argv.includes('--connect') && process.env.MONGO_URI) {
  checkMongoConnection().then(() => process.exit(ok ? 0 : 1));
} else {
  console.log('Tip: run `npm run check-env -- --connect` to test MongoDB authentication.');
  process.exit(ok ? 0 : 1);
}
