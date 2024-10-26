'use client'

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "../components/Header";

export default function Dashboard() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login"); // Redirect only if not loading and no user
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return <p>Loading...</p>; // Show loading until auth state is determined
  }

  return (
    <div>
      <Header />
      <h1>User Dashboard</h1>
      <p>Welcome, {currentUser.email}!</p>
      {/* Add more user-specific content here */}
    </div>
  );
}
