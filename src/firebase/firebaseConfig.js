import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGyZDqG00t5w-tjtI8eALl6sdmzmZSKJw",
  authDomain: "roommate-chore-tracker-bf0cc.firebaseapp.com",
  databaseURL: "https://roommate-chore-tracker-bf0cc-default-rtdb.firebaseio.com",
  projectId: "roommate-chore-tracker-bf0cc",
  storageBucket: "roommate-chore-tracker-bf0cc.appspot.com",
  messagingSenderId: "655312738615",
  appId: "1:655312738615:web:848ec8fd4a1e36620b22b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 REQUIRED EXPORTS
export const db = getDatabase(app);
export const auth = getAuth(app);