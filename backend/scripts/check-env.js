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

process.exit(ok ? 0 : 1);
