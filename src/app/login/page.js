"use client";

import {useState} from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../firebase";
import Header from "../components/Header";
import {useRouter} from "next/navigation"; // Corrected import
import "./Login.css"; // Import the new CSS file

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Add showPassword state
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
            <Header/>
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
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                        <button
                            type="button"
                            className={`toggle-password-visibility ${showPassword ? "active" : ""}`}
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <svg
                                    fill="#ffffff"
                                    width="20px"
                                    height="20px"
                                    viewBox="-1 -.5 26 20"
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
                                    viewBox="-1 -.5 26 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M21.92,11.6C19.9,6.91,16.1,4,12,4S4.1,6.91,2.08,11.6a1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20s7.9-2.91,9.92-7.6A1,1,0,0,0,21.92,11.6ZM12,18c-3.17,0-6.17-2.29-7.9-6C5.83,8.29,8.83,6,12,6s6.17,2.29,7.9,6C18.17,15.71,15.17,18,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z"/>
                                </svg>
                            )}
                        </button>
                    </div>
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
                        dangerouslySetInnerHTML={{__html: errorMessage}}
                    ></p>
                )}
            </div>
        </div>
    );
}
