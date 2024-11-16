"use client";

import { useState } from "react";
import "./create-post.css";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

export default function CreatePost() {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    const [petName, setPetName] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        
        if (file && file.type.startsWith('image/')) {
            setPhoto(file);
            setError(''); 

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setError('Please select a valid image file');
            setPhoto(null);
            setPreview(null);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!petName || !description || !photo) {
            setError("All fields are required");
            return;
        }

        setIsSubmitted(true);
    };
    
    const redirect = () => {
        router.push('/');
    }

    const handleEdit = () => {
        setIsSubmitted(false); // Allow the user to go back and edit
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!currentUser) {
        return (
            <div>
                <Header />
                <div className="centered-content">
                    <h1>Please log in or sign up to create a post</h1>
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
        );
    }

    return (
        <div>
            <Header/>
            <div className="create-title">
                <h1>Create a New Post</h1>
            </div>

            <div className="full-screen">
                <div className="create-post-container">
                    {error && <p className="error-message">{error}</p>}

                    {!isSubmitted ? (
                        <form className="info-container" onSubmit={handleSubmit}>
                            <div className="image-upload">
                                <label htmlFor="photo">Add Photo:</label>
                                <input type="file" id="photo" accept="image/*" onChange={handleFileChange} />
                                {preview && <img src={preview} alt="Preview" style={{width: 'auto', maxHeight: '300px'}} />}
                            </div>
                            <div className="pet-name">
                                <label htmlFor="petName">Pet name: </label>
                                <input
                                    type="text"
                                    id="petName"
                                    name="petName"
                                    value={petName}
                                    onChange={(e) => setPetName(e.target.value)}
                                />
                            </div>
                            <div className="desc-container">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="desc-input"
                                />
                            </div>

                            <button type="submit">Add</button>
                        </form>
                    ) : (
                        <div className="output-card">
                            <h3 className="confirmation-text">Post saved successfully!</h3>
                            <div className="image-upload">
                                {preview && <img src={preview} alt="Pet" style={{ width: 'auto', maxHeight: '300px' }} />}
                            </div>
                            <h3>{petName}</h3>
                            <p>{description}</p>
                            <button onClick={redirect}>Return to Home</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}