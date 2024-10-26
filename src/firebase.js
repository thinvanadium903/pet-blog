// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Our web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAMCME0DYuURAG6_eXKSMiA9P5vBlyhej8",
    authDomain: "uga-pet-blog.firebaseapp.com",
    projectId: "uga-pet-blog",
    storageBucket: "uga-pet-blog.appspot.com",
    messagingSenderId: "273469261614",
    appId: "1:273469261614:web:50b070239502c1bc225cbf"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Export Firestore instance