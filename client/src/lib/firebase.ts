import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvgkwDizBIzL4icO68FPeH6HyCGEjzTxY",
  authDomain: "supplysetu-14eba.firebaseapp.com",
  projectId: "supplysetu-14eba",
  storageBucket: "supplysetu-14eba.firebasestorage.app",
  messagingSenderId: "518142343188",
  appId: "1:518142343188:web:fc6d32313085f8b90bcf01",
  measurementId: "G-N4B5R66STM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
