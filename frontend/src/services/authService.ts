import axios from 'axios';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useUserStore } from '@/stores/userStore';

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseToken = await userCredential.user.getIdToken();
  console.log("Firebase Token:", firebaseToken);
  const res = await axios.post("http://localhost:3000/auth/login", {}, {
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
    },
  });
  
  const store = useUserStore();
  console.log("ROLE:", res.data.data.userRole)

  const userData = {
    name: res.data.data.name,  
    uid: res.data.data.uid,    
    role: res.data.data.userRole,
    token: firebaseToken  // Salva l'ID token
  };
  
  store.setUser(userData);
  console.log("--- store name:", store.name);
  console.log("--- store uid:", store.uid);
  console.log("--- store role:", store.role);
  console.log("Firebase ID Token salvato:", firebaseToken);
  
  return { role: store.role, token: firebaseToken };
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
    auth.languageCode = 'it';
    await sendPasswordResetEmail(auth, email);
    console.log("Reset password email sent to:", email);
  } catch (error) {
    console.error("Error durin:", error);
    throw error; 
  }
}