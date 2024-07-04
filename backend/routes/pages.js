const express = require('express');
const db = require('../config/database');
const Page = db.page;
const verifyToken = require('../middleware/authJWT');
const checkRole = require('../middleware/checkRole');
const { Op } = require('sequelize');

// Остальной код остается прежним


const router = express.Router();

router.post('/', verifyToken, checkRole('admin'), async (req, res) => {
    const { title, content } = req.body;
    const createdBy = req.user.id;

    if (!title || !content) return res.status(400).send('Title and content are required');

    try {
        const newPage = await Page.create({ title, content, createdBy });
        res.status(201).json({ id: newPage.id, title: newPage.title });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating page');
    }
});

router.put('/:id', verifyToken, checkRole('admin'), async (req, res) => {
    const { title, content } = req.body;
    const updatedBy = req.user.id; // Получение ID пользователя из токена
    const pageId = req.params.id;

    if (!title || !content) return res.status(400).send('Title and content are required');

    try {
        const page = await Page.findByPk(pageId);
        if (!page) return res.status(404).send('Page not found');

        page.title = title;
        page.content = content;
        page.updatedBy = updatedBy; // Обновление поля updatedBy
        page.updatedAt = new Date(); // Обновление поля updatedAt

        await page.save();

        res.status(200).json({ id: page.id, title: page.title, content: page.content, updatedAt: page.updatedAt, updatedBy: page.updatedBy });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating page');
    }
});

router.delete('/:id', verifyToken, checkRole('admin'), async (req, res) => {
    const pageId = req.params.id;

    try {
        const page = await Page.findByPk(pageId);
        if (!page) return res.status(404).send('Page not found');

        // Удалить все комментарии, связанные с этой страницей
        await db.comment.destroy({ where: { pageId: pageId } });

        // Удалить страницу
        await page.destroy();

        res.status(200).json({ response: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting page');
    }
});
router.get('/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).send('Search query is required');
    }

    try {
        const pages = await Page.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${query}%` } },
                    { content: { [Op.iLike]: `%${query}%` } }
                ]
            }
        });

        res.status(200).json(pages);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error searching pages');
    }
});
// GET: Чтение страницы по ID
// GET: Получение страницы по ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    
    // Проверка, является ли id числом
    if (isNaN(id)) {
        return res.status(400).send('Invalid page ID');
    }
    
    try {
        const page = await Page.findByPk(id);
        if (!page) {
            return res.status(404).send('Page not found');
        }
        
        res.status(200).json(page);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching page');
    }
});
// Добавьте этот код в routes/pages.js
// GET: Поиск страниц


router.get('/', async (req, res) => {
    try {
        const pages = await Page.findAll({ attributes: ['id', 'title', 'content'] });
        res.status(200).json(pages);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving pages');
    }
});

module.exports = router;
