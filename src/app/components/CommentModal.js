import React, {useState, useEffect} from 'react';
import {db} from '../../firebase';
import {collection, addDoc, query, orderBy, getDocs, doc, getDoc} from 'firebase/firestore';
import Modal from 'react-modal';
import {toast} from 'react-toastify';
import {useAuth} from '../../context/AuthContext'; // Import useAuth for user data
import '../stylesheets/CommentModal.css';

function CommentModal({isOpen, onRequestClose, postId}) {
    const {currentUser} = useAuth(); // Access current user
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchComments = async () => {
                setLoading(true);
                try {
                    const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
                    const querySnapshot = await getDocs(q);
                    const commentsData = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setComments(commentsData);
                } catch (error) {
                    toast.error('Failed to load comments.');
                } finally {
                    setLoading(false);
                }
            };
            fetchComments();
        }
    }, [isOpen, postId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            toast.warn('Comment cannot be empty.');
            return;
        }

        setSubmitting(true);

        try {
            let userName;

            // Check if currentUser is available
            if (currentUser) {
                userName = currentUser.displayName;

                // Fetch the userName from Firestore if displayName is not available
                if (!userName) {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    if (userDoc.exists()) {
                        userName = userDoc.data().name || 'Unknown User';
                    } else {
                        userName = 'Unknown User'; // Fallback for users without a name
                    }
                }
            } else {
                userName = 'Guest'; // If no user is logged in, set a fallback username
            }

            const newCommentData = {
                text: newComment.trim(),
                userName: userName,
                userId: currentUser?.uid || 'anonymous', // Store user ID or set anonymous for guests
                createdAt: new Date(),
            };

            await addDoc(collection(db, 'posts', postId, 'comments'), newCommentData);

            setComments((prev) => [...prev, newCommentData]);
            setNewComment('');
        } catch (error) {
            toast.error('Failed to add comment.');
            console.error('Error adding comment: ', error);
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="comment-modal-wrapper comment-modal"
            overlayClassName="comment-modal-overlay"
            ariaHideApp={false}
        >
            <div className="comment-modal-wrapper">
                <div className="comment-modal-content">
                    <button className="comment-close-button" onClick={onRequestClose}>
                        ✖
                    </button>
                    <h3 className="comment-header">Comments</h3>
                    {loading ? (
                        <p>Loading comments...</p>
                    ) : (
                        <div className="comment-list">
                            {comments.map((comment, index) => (
                                <div key={index} className="comment-item">
                                    <span className="comment-username">{comment.userName}</span>
                                    <span className="comment-text">{comment.text}</span>
                                </div>
                            ))}
                            {comments.length === 0 && <p>No comments yet.</p>}
                        </div>
                    )}
                    {currentUser ? (
                        <>
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment"
                                className="comment-input"
                            />
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim() || submitting}
                                className="comment-submit-button"
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </>
                    ) : (
                        <p className="comment-modal comment-login-message">Log in to add a comment.</p>
                    )}
                </div>
            </div>
        </Modal>


    );
}

export default CommentModal;
