"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import "./SignUp.css"; // Import the new CSS file

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State for password visibility toggle
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

    const [hasInteracted, setHasInteracted] = useState({
        name: false,
        email: false,
        password: false,
    });

    // email is a valid entry
    const validEmail = () => {
        if (email.includes(" ")) return false; // there are spaces in the email

    const parts = email.split("@");
    if (parts.length != 2) return false; // there is not exactly one @

        // check part before @
        if (parts[0].length === 0) return false; // there is nothing before the @

        // check part after @
        if (parts[1].indexOf(".") < 1) return false; // either there is no . or it is directly after the @
        if (parts[1].charAt(parts[1].length - 1) === ".") return false; // the last character is a .

        return true;
    };

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
                        onChange={(e) => {
                            setName(e.target.value);
                            setHasInteracted((prev) => ({...prev, name: true}));
                        }}
                        placeholder="Name"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setHasInteracted((prev) => ({...prev, email: true}));
                        }}
                        placeholder="Email"
                        required
                    />
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setHasInteracted((prev) => ({...prev, password: true}));
                            }}
                            placeholder="Password"
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password-visibility"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <svg
                                    fill="#ffffff"
                                    width="20px"
                                    height="20px"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10.94,6.08A6.93,6.93,0,0,1,12,6c3.18,0,6.17,2.29,7.91,6a15.23,15.23,0,0,1-.9,1.64,1,1,0,0,0-.16.55,1,1,0,0,0,1.86.5,15.77,15.77,0,0,0,1.21-2.3,1,1,0,0,0,0-.79C19.9,6.91,16.1,4,12,4a7.77,7.77,0,0,0-1.4.12,1,1,0,1,0,.34,2ZM3.71,2.29A1,1,0,0,0,2.29,3.71L5.39,6.8a14.62,14.62,0,0,0-3.31,4.8,1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20a9.26,9.26,0,0,0,5.05-1.54l3.24,3.25a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Zm6.36,9.19,2.45,2.45A1.81,1.81,0,0,1,12,14a2,2,0,0,1-2-2A1.81,1.81,0,0,1,10.07,11.48ZM12,18c-3.18,0-6.17-2.29-7.9-6A12.09,12.09,0,0,1,6.8,8.21L8.57,10A4,4,0,0,0,14,15.43L15.59,17A7.24,7.24,0,0,1,12,18Z"/>
                                </svg>
                            ) : (
                                <svg
                                    fill="#ffffff"
                                    width="20px"
                                    height="20px"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M21.92,11.6C19.9,6.91,16.1,4,12,4S4.1,6.91,2.08,11.6a1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20s7.9-2.91,9.92-7.6A1,1,0,0,0,21.92,11.6ZM12,18c-3.17,0-6.17-2.29-7.9-6C5.83,8.29,8.83,6,12,6s6.17,2.29,7.9,6C18.17,15.71,15.17,18,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z"/>
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="warnings">
                        <p className={validName() ? "valid-entry" : "invalid-entry"}>
                            Name must be non-empty{validName() ? <span>✅</span> : <span>❌</span>}
                        </p>
                        <p className={validEmail() ? "valid-entry" : "invalid-entry"}>
                            Must use a valid email{validEmail() ? <span>✅</span> : <span>❌</span>}
                        </p>
                        <p className={validPassword() ? "valid-entry" : "invalid-entry"}>
                            Password must be at least 6 characters{validPassword() ? <span>✅</span> : <span>❌</span>}
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="signup-button"
                        disabled={!(validName() && validEmail() && validPassword())}
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}
