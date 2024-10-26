'use client';

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Link from "next/link";
import './Dashboard.css'; // Import the new CSS file

export default function Dashboard() {
  const { currentUser, loading, logout } = useAuth();
  const router = useRouter();
  const [isDelayed, setIsDelayed] = useState(true);

  useEffect(() => {
    // Set a small delay before showing the content
    const delayTimer = setTimeout(() => {
      setIsDelayed(false);
    }, 400); // Adjust the delay time as needed (300ms here)

    return () => clearTimeout(delayTimer); // Clear the timeout on component unmount
  }, []);

  useEffect(() => {
    if (!loading && !currentUser && !isDelayed) {
      // Do nothing, as we'll handle this with a message
    }
  }, [currentUser, loading, router, isDelayed]);

  if (loading || isDelayed) {
    return (
      <Header />
    ); // Display a loading message while waiting for auth state or delay
  }

  // If there is no authenticated user and loading is complete, show message and buttons
  if (!currentUser) {
    return (
      <div>
        <Header />
        <div className="centered-content">
          <div className="message-box">
            <h1>Please log in first</h1>
            <p>You need to be logged in to access the user dashboard.</p>
            <div className="button-container">
              <Link href="/login">
                <button className="auth-button">Log In</button>
              </Link>
              <Link href="/signup">
                <button className="auth-button">Sign Up</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle the logout action with a delay
const handleLogout = async () => {
  try {
    router.push("/login"); // Redirect to login page after logout
    
    // Set a timeout before calling logout
    setTimeout(async () => {
      await logout();
    }, 400); // Adjust the delay time as needed (e.g., 300ms)
  } catch (error) {
    console.error("Failed to log out:", error);
  }
};


  return (
    <div>
      <Header />
      <div className="dashboard-container">
        <h1 className="dashboard-header">User Dashboard</h1>
        <div className="user-info-card">
          <p><strong>Welcome,</strong> {currentUser.name || "User"}!</p>
          <p><strong>Email:</strong> {currentUser.email || "No email available"}</p>
        </div>
        <div className="user-action-buttons">
          <button className="dashboard-button">Settings</button> {/* TODO: Add settings page (not implemented yet) */}
          <button className="dashboard-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
