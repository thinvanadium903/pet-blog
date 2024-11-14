"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import './SignUp.css'; // Import the new CSS file

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Create a user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user info (name) in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
      });

      router.push("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.log(error);
      alert("Error signing up: " + error.message);
    }
  };

  // email is a valid entry
  const validEmail = () => {
    if (email.includes(" ")) return false; // there are spaces in the email

    const parts = email.split("@");
    if (parts.length != 2) return false; // there is not exactly one @

    // check part before @
    if (parts[0].length == 0) return false; // there is nothing before the @

    // check part after @
    if (parts[1].indexOf('.') < 1) return false; // either there is no . or it is directly after the @
    if (parts[1].charAt(parts[1].length - 1) == '.') return false; // the last character is a .

    return true;
  }  

  // name is non-empty
  const validName = () => name.length > 0;

  // password is at least 6 characters
  const validPassword = () => password.length >= 6;

  return (
    <div>
      <Header />
      <div className="signup-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <div className="warnings">
            {validName() ? <p className="valid-entry"><s>Name must be non-empty</s></p> : <p className="invalid-entry">Name must be non-empty</p>}
            {validEmail() ? <p className="valid-entry"><s>Must use a valid email</s></p> : <p className="invalid-entry">Must use a valid email</p>}
            {validPassword() ? <p className="valid-entry"><s>Password must be at least 6 characters</s></p> : <p className="invalid-entry">Password must be at least 6 characters</p>}
          </div>
          <button type="submit" disabled={validName() && validEmail() && validPassword() ? false : true}>Sign Up</button>
        </form>
      </div>
    </div>
  );
}


