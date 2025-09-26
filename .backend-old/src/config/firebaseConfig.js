// .backend-old/src/config/firebaseConfig.js
const admin = require('firebase-admin');
const path = require('path'); // <- Tambahkan ini

// Bentuk path absolut dari root project ke file service account
const serviceAccountPath = path.join(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

// Gunakan path absolut tersebut untuk me-require file
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

console.log('✅ Firebase Admin SDK berhasil terinisialisasi.');
module.exports = admin;