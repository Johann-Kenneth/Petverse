import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Parse Firebase credentials from .env
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
