import { API_URL } from "@/constants/API_URL";
import { auth } from "@/firebase";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";

export const loginUser = async (email: string, password: string, redirect?:string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseToken = await userCredential.user.getIdToken();
  console.log("Firebase Token:", firebaseToken);

  const res = await axios.post(
    `${API_URL}/auth/login`,
    {},
    {
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
      },
    },
  );
  const { data: userData } = res.data;
  const store = useUserStore();
  
  store.setUser({
    name: userData.name,  
    uid: userData.uid,    
    role: userData.userRole,
    fb_token: firebaseToken
  });
  
  if (redirect) {
    window.location.href =redirect;
  }
};

export const logoutUser = async () => {
  try {
    const store = useUserStore();
    store.clearUser();
    await auth.signOut();
    console.log("Disconnected user from Firebase and cleared user store.");
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};

export const resetPasswordFirebase = async (email: string) => {
  try {
    auth.languageCode = "it";
    await sendPasswordResetEmail(auth, email);
    console.log("Reset password email sent to:", email);
  } catch (error) {
    console.error("Error durin:", error);
    throw error;
  }
};
