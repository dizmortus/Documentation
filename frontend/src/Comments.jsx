import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Comments = ({ pageId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const user = useSelector(state => state.user.user);

    useEffect(() => {
        axios.get(`/api/pages/${pageId}/comments`)
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
                    setComments([...comments, response.data]);
                    setNewComment('');
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    return (
        <div className="comments">
            <h3>Комментарии</h3>
            {comments.map(comment => (
                <div key={comment.id} className="comment">
                    <p>{comment.comment}</p>
                    <small>От: {comment.userId}</small>
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
