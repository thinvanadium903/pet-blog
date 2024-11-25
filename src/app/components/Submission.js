'use client';

import {useState, useEffect} from 'react';
import {db} from '../../firebase';
import {doc, collection, getDoc, runTransaction} from 'firebase/firestore';
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

    useEffect(() => {
        // Trigger fade-in animation on mount
        setFadeIn(true);

        const fetchLikesAndComments = async () => {
            try {
                // Get the total like count
                const postDocRef = doc(db, 'posts', id);
                const postSnap = await getDoc(postDocRef);

                if (postSnap.exists()) {
                    setLikes(postSnap.data().likeCount || 0);
                    setCommentCount(postSnap.data().commentCount || 0);
                }
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };

        fetchLikesAndComments();
    }, [id, currentUser]);

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
                {createdAt && <p>Posted on: {formatDate(createdAt.seconds)}</p>}
                <button
                    className={`like-icon ${liked ? 'liked' : 'unliked'}`}
                    onClick={handleLike}
                    disabled={loading}
                >
                    {liked ? '❤️' : '🩶'} {likes}
                </button>
                <button onClick={toggleCommentModal}>
                    💬 {commentCount} Comments
                </button>
            </div>
            <CommentModal
                isOpen={isCommentModalOpen}
                onRequestClose={() => setCommentModalOpen(false)}
                postId={id} // Ensure this is correctly passed for fetching comments
                className="comment-modal-wrapper" // Added for scoping
                overlayClassName="comment-modal-wrapper" // Ensure scoped overlay
            />
        </div>
    );
}

export default Submission;
