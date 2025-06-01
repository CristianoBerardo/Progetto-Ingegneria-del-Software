import admin from "firebase-admin";

let serviceAccountCredentials;
try {
  serviceAccountCredentials = require("/etc/secrets/serviceAccountKey.json");
} catch (e) {
  console.error(
    "Failed to load service account credentials from /etc/secrets/serviceAccountKey.json - DO NOT PANIC! This is for the production environment.",
  );
}

if (!serviceAccountCredentials) {
  console.error("serviceAccountCredentials environment variable not set.");

  try {
    const serviceAccountLocal = require("./serviceAccountKey.json"); // For local dev only
    serviceAccountCredentials = serviceAccountLocal;
    console.warn("\nLoaded serviceAccountKey.json from local file (DEV ONLY)");
  } catch (e) {
    console.error(
      "serviceAccountKey.json not set and local serviceAccountKey.json not found.",
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
