'use client'

import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import '../stylesheets/Body.css'
import SubmissionGrid from "./SubmissionGrid";
import Link from 'next/link';

function Body() {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const querySnapshot = await getDocs(collection(db, 'posts'));
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
            <Link href="/create-post">
                <button className="create-post-button">+</button>
            </Link>
        </div>
    );
}

export default Body;