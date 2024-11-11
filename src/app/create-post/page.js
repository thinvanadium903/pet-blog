"use client";

import { useState } from "react";
import "./create-post.css"
import Header from "../components/Header";

export default function CreatePost() {
    const [petName, setPetName] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setPhoto(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Handle the post submission to uploading data to the server
        console.log('Photo:', photo);
        console.log('Pet Name:', petName);
        console.log('Description:', description);

        setPetName('');
        setDescription('');
        setPhoto(null);
        setPreview(null);
    };

    return (
        <div>
            <Header />
            <div className="create-post-container">
                <h1>Create a New Post</h1>
                <form className="info-container" onSubmit={handleSubmit}>
                    <div className="image-upload">
                        <label htmlFor="photo">Add Photo:</label>
                        <input type="file" id="photo" accept="image/*" onChange={handleFileChange} />
                        {preview && <img src={preview} alt="Preview" style={{ width: '100px', height: '100px' }} />}
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
            </div>
        </div>
    );
}