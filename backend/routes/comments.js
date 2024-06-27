const express = require('express');
const router = express.Router();
const { checkRole } = require('../middleware/checkRole');
const Comment = require('../models/Comment');

// Добавление нового комментария
router.post('/', async (req, res) => {
    const { userId, pageId, comment } = req.body;
    try {
        const newComment = await Comment.create({ userId, pageId, comment });
        res.status(201).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Получение комментариев для страницы
router.get('/:pageId', async (req, res) => {
    const { pageId } = req.params;
    try {
        const comments = await Comment.findAll({ where: { pageId } });
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve comments' });
    }
});

module.exports = router;
