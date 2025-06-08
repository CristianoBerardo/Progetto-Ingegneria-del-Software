import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../../../frontend/src/firebase";

export const getFirebaseToken = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password,
    );
    const firebaseToken = await userCredential.user.getIdToken();

    return {
      firebaseToken,
    };
  } catch (error) {
    console.error("Error fetching firebaseToken", error);
  }
};

// export const getFirebaseToken = async (credentials: {email: string, password: string}) => {
//   const firebaseAuth = auth;

//   try {
//     const userRecord = await firebaseAuth.getUserByEmail(credentials.email);
//     console.log("User record found:", userRecord);
//     if (userRecord.uid) {
//       const credential = await signInWithEmailAndPassword(
//         authFrontend,
//         credentials.email,
//         credentials.password,
//       );

//       const firebaseToken = await credential.user.getIdToken();
//       return {
//         firebaseToken,
//       };
//     }
//   } catch (error) {
//     console.error("Error fetching firebaseToken", error);
//   }
// };
