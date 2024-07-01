// Documentation/frontend/components/Comments.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Comments = ({ pageId }) => {
    const [newComment, setNewComment] = useState('');
    const comments = useSelector(state => state.comments.comments.filter(comment => comment.pageId === pageId));
    const user = useSelector(state => state.user.user);
    const isAdmin = user?.role === 'admin';
    const dispatch = useDispatch();

    useEffect(() => {
        const storedComments = JSON.parse(localStorage.getItem('comments')) || [];
        dispatch({ type: 'SET_COMMENTS', payload: storedComments });
    }, [dispatch]);

    const handleAddComment = () => {
        if (newComment) {
            const commentData = { id: comments.length + 1, userId: user.id, pageId, comment: newComment, user: { username: user.username } };
            const updatedComments = [...comments, commentData];
            localStorage.setItem('comments', JSON.stringify(updatedComments));
            dispatch({ type: 'ADD_COMMENT', payload: commentData });
            setNewComment('');
        }
    };

    const handleDeleteComment = (commentId) => {
        const updatedComments = comments.filter(comment => comment.id !== commentId);
        localStorage.setItem('comments', JSON.stringify(updatedComments));
        dispatch({ type: 'REMOVE_COMMENT', payload: commentId });
    };

    return (
        <div className="comments">
            <h3>Комментарии</h3>
            {comments.map(comment => (
                <div key={comment.id} className="comment">
                    <p>{comment.comment}</p>
                    <small>От: {comment.user.username}</small>
                    {isAdmin && (
                        <button onClick={() => handleDeleteComment(comment.id)} className="delete-button">
                            Удалить
                        </button>
                    )}
                </div>
            ))}
            {user ? (
                <div className="add-comment">
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Оставьте комментарий"
                    />
                    <button onClick={handleAddComment}>Добавить</button>
                </div>
            ) : (
                <p>Вы должны войти, чтобы оставить комментарий.</p>
            )}
        </div>
    );
};

export default Comments;
