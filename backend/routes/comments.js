const express = require('express');
const router = express.Router();
const { checkRole } = require('../middleware/checkRole');
const db = require('../config/database');
const Comment = db.comment;

// Добавление нового комментария
router.post('/', async (req, res) => {
    const { userId, pageId, comment } = req.body;
    try {
        const newComment = await Comment.create({ userId, pageId, comment });
        const commentWithUser = await Comment.findOne({
            where: { id: newComment.id },
            include: {
                model: db.user,
                as: 'user',
                attributes: ['username']
            }
        });
        res.status(201).json(commentWithUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Получение комментариев для страницы
router.get('/:pageId', async (req, res) => {
    const { pageId } = req.params;
    try {
        const comments = await db.comment.findAll({
            where: { pageId: pageId },
            include: {
                model: db.user,
                as: 'user',
                attributes: ['username']
            }
        });
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve comments' });
    }
});

// Удаление комментария
router.delete('/:commentId', async (req, res) => {
    const { commentId } = req.params;
    try {
        const result = await Comment.destroy({ where: { id: commentId } });
        if (result) {
            res.json({ message: 'Comment deleted successfully' });
        } else {
            res.status(404).json({ error: 'Comment not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});

module.exports = router;
