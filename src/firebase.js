// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import dotenv from 'dotenv';

dotenv.config();

// Our web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  authDomain: "uga-pet-blog.firebaseapp.com",
  projectId: "uga-pet-blog",
  storageBucket: "uga-pet-blog.appspot.com",
  messagingSenderId: "273469261614",
  appId: "1:273469261614:web:50b070239502c1bc225cbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
