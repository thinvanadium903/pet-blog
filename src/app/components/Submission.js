'use client';

import {useState, useEffect} from 'react';
import {db} from '../../firebase';
import {doc, collection, getDoc, runTransaction, onSnapshot} from 'firebase/firestore';
import {useAuth} from '../../context/AuthContext';
import {toast} from 'react-toastify'; // Import toast
import '../stylesheets/Submission.css';
import CommentModal from './CommentModal';

function Submission({id, name, imageUrl, description, userName, createdAt}) {
    const {currentUser} = useAuth();
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [isCommentModalOpen, setCommentModalOpen] = useState(false);

    // Fetch likes and set them in real time
    useEffect(() => {
        setFadeIn(true); // Trigger fade-in animation

        const postDocRef = doc(db, 'posts', id);

        // Listen to real-time updates for the post's likeCount field
        const unsubscribe = onSnapshot(postDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                setLikes(docSnapshot.data().likeCount || 0); // Update the likes in real-time
            } else {
                console.error('Post does not exist!');
            }
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, [id]);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (currentUser) {
                const likeDocRef = doc(collection(db, 'posts', id, 'likes'), currentUser.uid);
                const docSnapshot = await getDoc(likeDocRef);
                if (docSnapshot.exists()) {
                    setLiked(true);
                }
            }
        };
        fetchLikeStatus();
    }, [currentUser, id]);


    // Fetch comments count and update it in real-time
    useEffect(() => {
        const commentsCollectionRef = collection(db, 'posts', id, 'comments');
        const unsubscribe = onSnapshot(commentsCollectionRef, (snapshot) => {
            setCommentCount(snapshot.size); // Update comment count based on the number of documents
        });

        return () => unsubscribe(); // Clean up the listener when the component unmounts
    }, [id]);

    const handleLikeClick = () => {
        toast.warn('Please log in or sign up to like posts!', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
                width: '350px', // Adjust width as needed
            },
        });
    };

    const handleLike = async () => {
        if (!currentUser) {
            handleLikeClick(); // Call the function here
            return; // Exit the function early since no user is logged in
        }

        // Proceed with like functionality if the user is logged in
        setLoading(true); // Disable button
        const postDocRef = doc(db, 'posts', id);
        const likeDocRef = doc(collection(db, 'posts', id, 'likes'), currentUser.uid);

        try {
            await runTransaction(db, async (transaction) => {
                const postDoc = await transaction.get(postDocRef);
                if (!postDoc.exists()) {
                    throw new Error('Post does not exist!');
                }

                const likeCount = postDoc.data().likeCount || 0;

                if (liked) {
                    // User is unliking the post
                    transaction.delete(likeDocRef);
                    transaction.update(postDocRef, {likeCount: likeCount - 1});
                    setLikes((prev) => prev - 1);
                    setLiked(false);
                } else {
                    // User is liking the post
                    transaction.set(likeDocRef, {userId: currentUser.uid, likedAt: new Date()});
                    transaction.update(postDocRef, {likeCount: likeCount + 1});
                    setLikes((prev) => prev + 1);
                    setLiked(true);
                }
            });
        } catch (error) {
            console.error('Error updating like data:', error);
        } finally {
            setLoading(false); // Re-enable button
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    };

    const divStyle = {
        backgroundImage: `url(${imageUrl})`,
    };

    // Function to toggle modal visibility
    const toggleCommentModal = () => {
        setCommentModalOpen((prev) => !prev);
    };

    return (
        <div className={`submission-whole ${fadeIn ? 'fade-in' : ''}`}>
            <div className="image" style={divStyle}></div>
            <div className="submission-preview">
                <div className="submission-name">
                    <h2>{name}</h2>
                </div>
                <p>{description}</p>
                {userName && <i id="source">Created by {userName}</i>}
                <div className="submission-meta">
                    {createdAt && (
                        <p className="posted-on">Posted on: {formatDate(createdAt.seconds)}</p>
                    )}
                    <button
                        className={`like-icon ${liked ? 'liked' : 'unliked'}`}
                        onClick={handleLike}
                        disabled={loading}
                        aria-label={liked ? 'Unlike this post' : 'Like this post'}
                        title={liked ? 'Unlike this post' : 'Like this post'}
                    >
                        <span className="like-heart">{liked ? '❤️' : '🩶'}</span>
                        <span className="like-count">{likes}</span>
                    </button>
                </div>

                <button className="comments-button" onClick={toggleCommentModal}>
                    <span className="icon">💬</span>
                    <span>{commentCount} Comments</span>
                    <div className="tooltip">Click to post your own comment! </div>
                </button>
            </div>
            <CommentModal
                isOpen={isCommentModalOpen}
                onRequestClose={() => setCommentModalOpen(false)}
                postId={id}
                className="comment-modal-wrapper"
                overlayClassName="comment-modal-wrapper"
            />
        </div>
    );
}

export default Submission;
