'use client'

import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, getDoc, doc, query, orderBy } from 'firebase/firestore';
import '../stylesheets/Body.css'
import SubmissionGrid from "./SubmissionGrid";
import Link from 'next/link';

function Body() {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const q = query(collection(db, 'posts'), orderBy('createdAt', 'asc'));
            const querySnapshot = await getDocs(q);
            const posts = await Promise.all(querySnapshot.docs.map(async (postDoc) => {
                const postData = postDoc.data();
                const userDocRef = doc(db, 'users', postData.userId);
                const userDoc = await getDoc(userDocRef);
                const userName = userDoc.exists() ? userDoc.data().name : 'Unknown User';
                return {
                    id: postDoc.id,
                    ...postData,
                    userName,
                };
            }));
            setSubmissions(posts);
        };

        fetchPosts();
    }, []);

    return (
        <div className="body">
            <SubmissionGrid submissions={submissions}></SubmissionGrid>
            <div className="create-post-container">
                <Link href="/create-post">
                    <p className="create-post-text">Create New Post</p>
                    <button className="create-post-button">+</button>
                </Link>
            </div>
        </div>
    );
}

export default Body;