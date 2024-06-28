import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Comments = ({ pageId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const user = useSelector(state => state.user.user);
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        axios.get(`/api/comments/${pageId}`)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [pageId]);

    const handleAddComment = () => {
        if (newComment) {
            const commentData = { userId: user.id, pageId, comment: newComment };
            axios.post('/api/comments', commentData)
                .then(response => {
                    // Update comments state with the new comment
                    setComments(prevComments => [...prevComments, response.data]);
                    setNewComment('');
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const handleDeleteComment = (commentId) => {
        axios.delete(`/api/comments/${commentId}`) // Отправляем DELETE запрос для удаления комментария
            .then(() => {
                // Фильтруем удаленный комментарий из списка
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
            })
            .catch(error => {
                console.error('Ошибка при удалении комментария:', error);
            });
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
