import {useState, useEffect} from 'react';
import {db} from '../../firebase';
import {collection, addDoc, query, orderBy, getDocs, doc, getDoc} from 'firebase/firestore';
import {useAuth} from '../../context/AuthContext';
import {toast} from 'react-toastify'; // Import toast for error handling
import '../stylesheets/Comment.css';

function Comment({postId}) {
    const {currentUser} = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false); // State for loading feedback
    const [submitting, setSubmitting] = useState(false); // State for submit feedback

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true); // Start loading
            try {
                const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
                const querySnapshot = await getDocs(q);
                const commentsData = querySnapshot.docs.map((commentDoc) => ({
                    id: commentDoc.id,
                    ...commentDoc.data(),
                }));
                setComments(commentsData);
            } catch (error) {
                console.error('Error fetching comments: ', error);
                toast.error('Failed to load comments. Please try again.');
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchComments();
    }, [postId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            toast.warn('Comment cannot be empty.');
            return;
        }

        setSubmitting(true); // Start submitting state
        try {
            let userName = currentUser.displayName;

            // If displayName is not available, fetch it from Firestore
            if (!userName) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    userName = userDoc.data().name || 'Unknown User';
                } else {
                    userName = 'Unknown User'; // Fallback if no user document exists
                }
            }

            const newCommentData = {
                userId: currentUser.uid,
                userName: userName,
                text: newComment.trim(),
                createdAt: new Date(),
            };

            // Add the comment to Firestore
            const docRef = await addDoc(collection(db, 'posts', postId, 'comments'), newCommentData);

            // Update state locally
            setComments((prev) => [...prev, {id: docRef.id, ...newCommentData}]);
            setNewComment(''); // Reset the input field
        } catch (error) {
            console.error('Error adding comment: ', error);
            toast.error('Failed to add comment. Please try again.');
        } finally {
            setSubmitting(false); // End submitting state
        }
    };

    return (
        <div className={`comment-section-container post-${postId}`}>
            <div
                className={`comment-section ${
                    comments.length === 0 && !loading ? 'no-comments' : ''
                }`}
            >
                {loading ? (
                    <p className="comment-loading">Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="comment-placeholder">No comments yet. Be the first to comment!</p>
                ) : (
                    <div>
                        {comments.map((comment) => (
                            <div key={comment.id} className="comment">
                                <p>
                                    <strong>{comment.userName}</strong>: {comment.text}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {currentUser ? (
                    <div className="comment-input-container">
                        <input
                            type="text"
                            className="comment-input"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment"
                            disabled={submitting}
                        />
                        <button
                            className="comment-button"
                            onClick={handleAddComment}
                            disabled={!newComment.trim() || submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                ) : (
                    <p className="login-message">Log in to add a comment</p>
                )}
            </div>
        </div>
    );


}

export default Comment;
