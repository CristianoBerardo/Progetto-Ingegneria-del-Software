import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnCEYeCvKlVrd5nMLo43o6ioFugLF6zL0",
  authDomain: "agritrento-ee49c.firebaseapp.com",
  projectId: "agritrento-ee49c",
  storageBucket: "agritrento-ee49c.firebasestorage.app",
  messagingSenderId: "265629131019",
  appId: "1:265629131019:web:d8cb065dedeaea109b420e",
  measurementId: "G-ETEJWDTJJ6",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { firebaseApp, auth };
