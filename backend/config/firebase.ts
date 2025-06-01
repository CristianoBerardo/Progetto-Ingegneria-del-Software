import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const deleteAllUsers = async function deleteAllUsers() {
  try {
    let pageToken;
    let deletedCount = 0;

    do {
      // List users in batches (max 1000 per request)
      const listUsersResult = await auth.listUsers(1000, pageToken);

      if (listUsersResult.users.length === 0) {
        console.log("No users found.");
        break;
      }

      // Extract UIDs from the users
      const uids = listUsersResult.users.map((user) => user.uid);

      console.log(`Deleting ${uids.length} users...`);

      // Delete users in batch (max 1000 per request)
      const deleteUsersResult = await auth.deleteUsers(uids);

      deletedCount += deleteUsersResult.successCount;

      console.log(`Successfully deleted: ${deleteUsersResult.successCount}`);
      console.log(`Failed to delete: ${deleteUsersResult.failureCount}`);

      // Log any failures
      if (deleteUsersResult.errors.length > 0) {
        console.log("Errors:");
        deleteUsersResult.errors.forEach((error) => {
          console.log(`- UID ${error.index}: ${error.error.message}`);
        });
      }

      // Get next page token for pagination
      pageToken = listUsersResult.pageToken;
    } while (pageToken);

    console.log(`\nTotal users deleted: ${deletedCount}`);
  } catch (error) {
    console.error("Error deleting users:", error);
  }
}
const auth = admin.auth();
export {auth};
export default admin;
