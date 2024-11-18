'use client';

import {useAuth} from "../../context/AuthContext";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Header from "../components/Header";
import Link from "next/link";
import './Dashboard.css'; // Import the new CSS file
import {collection, query, where, getDocs, doc, deleteDoc} from "firebase/firestore";
import {db} from "../../firebase";
import ConfirmationModal from '../confirm-modal/ConfirmationModal';

export default function Dashboard() {
    const {currentUser, loading, logout} = useAuth();
    const router = useRouter();
    const [isDelayed, setIsDelayed] = useState(true);
    const [userPosts, setUserPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);

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

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (currentUser) {
                try {
                    const q = query(collection(db, 'posts'), where('userId', '==', currentUser.uid));
                    const querySnapshot = await getDocs(q);
                    const posts = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        likeCount: doc.data().likeCount || 0,
                        ...doc.data()
                    }));
                    posts.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
                    setUserPosts(posts);
                } catch (error) {
                    console.error("Error fetching posts:", error);
                }
            }
        };

        fetchUserPosts();
    }, [currentUser]);

    if (loading || isDelayed) {
        return (
            <Header/>
        ); // Display a loading message while waiting for auth state or delay
    }

    // If there is no authenticated user and loading is complete, show message and buttons
    if (!currentUser) {
        return (
            <div>
                <Header/>
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

    const openModal = (postId) => {
        setPostIdToDelete(postId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPostIdToDelete(null);
    };

    const confirmDelete = async () => {
        try {
            // Reference to the document to delete
            const postDocRef = doc(db, 'posts', postIdToDelete);

            // Step 1: Recursively delete the subcollections (e.g., "likes")
            const deleteSubcollections = async (parentDocRef) => {
                const subcollections = ['likes']; // List all subcollection names here
                for (const subcollectionName of subcollections) {
                    const subcollectionRef = collection(parentDocRef, subcollectionName);
                    const subcollectionDocs = await getDocs(subcollectionRef);
                    const deletePromises = subcollectionDocs.docs.map(doc => deleteDoc(doc.ref));
                    await Promise.all(deletePromises); // Wait for all documents to be deleted
                }
            };

            await deleteSubcollections(postDocRef);

            // Step 2: Delete the main post document
            await deleteDoc(postDocRef);

            // Step 3: Update the UI state
            setUserPosts(userPosts.filter(post => post.id !== postIdToDelete));
            closeModal();
        } catch (error) {
            console.error("Error deleting post and its subcollections:", error);
        }
    };

    return (
        <div>
            <Header/>
            <div className="dashboard-container">
                <h1 className="dashboard-header">User Dashboard</h1>
                <div className="user-info-card">
                    <p><strong>Welcome,</strong> {currentUser.name || "User"}!</p>
                    <p><strong>Email:</strong> {currentUser.email || "No email available"}</p>
                </div>
                <div className="user-action-buttons">

                    {/* TODO: Add settings page (not implemented yet) */}
                    {/* <button className="dashboard-button">Settings</button> */}

                    <button className="dashboard-button" onClick={handleLogout}>Logout</button>
                </div>
                <div className="user-posts">
                    <h2>Your Posts</h2>
                    <br/>
                    {userPosts.length > 0 ? (
                        userPosts.map(post => (
                            <div key={post.id} className="post-card">
                                <img src={post.photoURL} alt={post.petName} className="post-image"/>
                                <div className="post-content">
                                    <h3>{post.petName}</h3>
                                    <p className="post-description">{post.description}</p>
                                    <p className="post-likes"> Likes: ❤️ {post.likeCount}
                                    </p>
                                    <p className="post-date">
                                        Posted
                                        on: {new Date(post.createdAt.seconds * 1000).toLocaleDateString()} at {new Date(post.createdAt.seconds * 1000).toLocaleTimeString()}
                                    </p>
                                </div>
                                <button className="delete-button" onClick={() => openModal(post.id)}>Delete</button>
                            </div>
                        ))
                    ) : (
                        <p>No posts yet.</p>
                    )}
                </div>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
