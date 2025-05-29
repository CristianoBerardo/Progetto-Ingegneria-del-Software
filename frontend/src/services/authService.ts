import axios from 'axios';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUserStore } from '@/stores/userStore';

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseToken = await userCredential.user.getIdToken();
  const res = await axios.post("http://localhost:3000/auth/login", {}, {
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
    },
  });
  //console.log("Risposta dal backend:", res.data);
  const store = useUserStore();
  console.log("ROLE:", res.data.data.userRole)
  // Salva il token JWT nel localStorage
  // localStorage.setItem("token", res.data.data.customToken);
  // localStorage.setItem("userRole", res.data.data.userRole);

  const userData = {
    name: res.data.data.name,  
    uid: res.data.data.uid,    
    role: res.data.data.userRole,
    token: res.data.data.customToken
  };
  
  store.setUser(userData);
  console.log("--- store name:", store.name);
  console.log("--- store uid:", store.uid);
  console.log("--- store role:", store.role);
  console.log("Token ricevuto dal backend:", res.data.data.customToken);
  
  return { role: store.role, token: res.data.data.customToken };
};