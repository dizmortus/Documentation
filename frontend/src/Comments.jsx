import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import TokenService from './services/TokenService';
import api from "./services/api";

const Comments = ({ pageId }) => {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const user = useSelector(state => state.user.user);
    const isAdmin = user?.role === 'admin';
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(`/api/comments/${pageId}`);
                setComments(response.data);
            } catch (err) {
                console.error('Error fetching comments:', err);
            }
        };

        fetchComments();
    }, [pageId, dispatch]);

    const handleAddComment = async () => {
        if (newComment) {
            try {
                const commentData = { userId: user.id, pageId, comment: newComment };
                const response = await api.post('/api/comments', commentData, {
                    headers: {
                        'x-access-token': `${TokenService.getLocalAccessToken()}`
                    }
                });
                setComments([...comments, response.data]);
                setNewComment('');
            } catch (err) {
                console.error('Error adding comment:', err);
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/api/comments/${commentId}`, {
                headers: {
                    'x-access-token': `${TokenService.getLocalAccessToken()}`
                }
            });
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
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
