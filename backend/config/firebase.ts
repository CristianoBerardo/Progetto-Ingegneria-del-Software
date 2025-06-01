import admin from "firebase-admin";

let serviceAccountCredentials;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccountCredentials = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT,
    );
  } catch (e) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", e);
    
    process.exit(1);
  }
} else {
  console.error("FIREBASE_SERVICE_ACCOUNT environment variable not set.");
  
  try {
    const serviceAccountLocal = require("./serviceAccountKey.json"); // For local dev only
    serviceAccountCredentials = serviceAccountLocal;
    console.warn("Loaded service account from local file (DEV ONLY)");
  } catch (e) {
    console.error(
      "FIREBASE_SERVICE_ACCOUNT not set and local serviceAccountKey.json not found.",
    );
    process.exit(1);
  }
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountCredentials),
  });
}

export default admin;
