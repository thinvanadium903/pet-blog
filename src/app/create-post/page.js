"use client";

import {useState} from "react";
import styles from './create-post.module.css';
import Header from "../components/Header";
import {useRouter} from "next/navigation";
import {useAuth} from "../../context/AuthContext";
import Link from "next/link";
import {db} from "../../firebase";
import {collection, addDoc} from "firebase/firestore";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import heic2any from "heic2any";

export default function CreatePost() {
    const {currentUser, loading: authLoading} = useAuth();
    const router = useRouter();

    const [petName, setPetName] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false); // Loading state for image processing

    const storage = getStorage();

    const processFile = async (file) => {
        if (!file) {
            setError("Please select a file");
            return;
        }

        setIsProcessing(true); // Show loading indicator

        if (file.type === "image/heic" || file.name.endsWith(".HEIC")) {
            try {
                // Convert HEIC to JPEG
                const convertedBlob = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                });

                const convertedFile = new File(
                    [convertedBlob],
                    file.name.replace(".HEIC", ".jpeg"),
                    {type: "image/jpeg"}
                );

                setPhoto(convertedFile);
                setError("");

                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                    setIsProcessing(false); // Hide loading indicator
                };
                reader.readAsDataURL(convertedFile);
            } catch (error) {
                console.error("Error converting HEIC file: ", error);
                setError("Failed to process HEIC file. Please try another image.");
                setPhoto(null);
                setPreview(null);
                setIsProcessing(false); // Reset processing state on error
            }
        } else if (file.type.startsWith("image/")) {
            setPhoto(file);
            setError("");

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setIsProcessing(false); // Hide loading indicator
            };
            reader.readAsDataURL(file);
        } else {
            setError("Please select a valid image file");
            setPhoto(null);
            setPreview(null);
            setIsProcessing(false); // Reset processing state
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        processFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0]; // Get the first file
        processFile(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!petName || !description || !photo) {
            setError("All fields are required");
            return;
        }

        try {
            // Create a storage reference
            const storageRef = ref(storage, `images/${photo.name}`);

            // Upload the file
            const snapshot = await uploadBytes(storageRef, photo);

            // Get the download URL
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Add a new document in the "posts" collection
            await addDoc(collection(db, "posts"), {
                petName,
                description,
                photoURL: downloadURL, // Store the download URL
                userId: currentUser.uid,
                createdAt: new Date()
            });

            setIsSubmitted(true);
            setError('');
        } catch (error) {
            console.error("Error adding document: ", error);
            setError("Failed to save post. Please try again.");
        }
    };

    const redirect = () => {
        router.push('/');
    };

    const handleEdit = () => {
        setIsSubmitted(false); // Allow the user to go back and edit
    };

    if (authLoading) {
        return <p></p>;
    }

    if (!currentUser) {
        return (
            <div>
                <Header/>
                <div className={styles.centeredContent}>
                    <h1>Please log in or sign up to <br/> create a post</h1>
                    <div className={styles.buttonContainer}>
                        <Link href="/login">
                            <button className={styles.authButton}>Log In</button>
                        </Link>
                        <Link href="/signup">
                            <button className={styles.authButton}>Sign Up</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header/>
            <div className={styles.createTitle}>
                <h1>Create a New Post</h1>
            </div>

            <div className={styles.fullScreen}>
                <div className={styles.createPostContainer}>
                    {error && <p className={styles.errorMessage}>{error}</p>}

                    {!isSubmitted ? (
                        <form className={styles.infoContainer} onSubmit={handleSubmit}>
                            <div
                                className={styles.imageUpload}
                                onDragOver={(e) => e.preventDefault()} // Prevent default to allow drop
                                onDragEnter={(e) => e.preventDefault()} // Prevent default
                                onDrop={handleDrop} // Handle file drop
                            >
                                <label htmlFor="photo" style={{cursor: "pointer", width: "100%"}}>
                                    <div className={styles.dragBox}>
                                        {isProcessing ? (
                                            <div className={styles.loadingIndicator}>
                                                <div className={styles.spinner}></div>
                                                <p>Processing your image...</p>
                                            </div>
                                        ) : preview ? (
                                            <img src={preview} alt="Preview" className={styles.previewImage}/>
                                        ) : (
                                            <>
                                                <span className={styles.labelText}>Add Photo:</span>
                                                <p>Drag and drop a file here, or click to select a file</p>
                                            </>
                                        )}
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    id="photo"
                                    accept="image/*,.heic"
                                    onChange={handleFileChange}
                                    style={{display: "none"}} // Hide the default file input
                                />
                            </div>

                            <div className={styles.fieldContainer}>
                                <label htmlFor="petName">
                                    <span className={styles.labelText}>Pet Name:</span>
                                </label>
                                <input
                                    type="text"
                                    id="petName"
                                    name="petName"
                                    value={petName}
                                    placeholder="Enter your pet's name"
                                    onChange={(e) => setPetName(e.target.value)}
                                />
                            </div>

                            <div className={styles.fieldContainer}>
                                <label htmlFor="description">
                                    <span className={styles.labelText}>Description:</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    placeholder="Write a short description"
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <button
                                className={`${styles.submitButton} ${
                                    !petName || !description || !photo ? styles.disabledButton : ""
                                }`}
                                type="submit"
                                disabled={!petName || !description || !photo}
                            >
                                Add
                            </button>
                        </form>

                    ) : (
                        <div className={styles.outputCard}>
                            <h2 className={styles.confirmationTitle}>🎉 Post Uploaded Successfully!</h2>
                            <div className={styles.imagePreviewContainer}>
                                {preview && <img src={preview} alt="Pet" className={styles.previewImage}/>}
                            </div>
                            <div className={styles.postDetails}>
                                <h3 className={styles.petName}>{petName}</h3>
                                <p className={styles.description}>{description}</p>
                            </div>
                            <button className={styles.returnButton} onClick={redirect}>
                                Return to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}