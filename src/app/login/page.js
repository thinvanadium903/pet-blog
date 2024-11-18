"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import Header from "../components/Header";
import { useRouter } from "next/navigation"; // Corrected import
import "./Login.css"; // Import the new CSS file

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const router = useRouter();

  const validEmail = () => email.includes("@") && email.includes(".");
  const validPassword = () => password.length >= 6;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
        setErrorMessage("Invalid email or password<br>Please try again"); // Set error message
    }
  };

  return (
      <div>
        <Header />
        <div className="login-container">
          <h1>Log In</h1>
          <form onSubmit={handleLogin}>
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
            <button
                type="submit"
                className="login-button"
                disabled={!email || !password || !(validEmail() && validPassword())}
            >
              Log In
            </button>
          </form>
            {errorMessage && (
                <p
                    className="error-message"
                    dangerouslySetInnerHTML={{ __html: errorMessage }}
                ></p>
            )}
        </div>
      </div>
  );
}
