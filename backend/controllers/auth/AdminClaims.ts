import admin from "../../config/firebase";
import { Role } from "../../types/Role";

export async function setAdminClaims(email: string): Promise<void> {
  try {
    // Get the user by email
    const userRecord = await admin.auth().getUserByEmail(email);

    // Set custom claims
    await admin
      .auth()
      .setCustomUserClaims(userRecord.uid, { role: Role.administrator });

    console.log(`Successfully set admin claims for user: ${email}`);
  } catch (error) {
    console.error("Error setting admin claims:", error);
    throw error;
  }
}