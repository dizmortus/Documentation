const express = require('express');
const db = require('../config/database');
const Page = db.page;
const verifyToken = require('../middleware/authJWT');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

// POST: Создание новой страницы
router.post('/', verifyToken, checkRole('admin'), async (req, res) => {
    const { title, content } = req.body;
    const createdBy = req.userId; // Предполагается, что req.userId содержит ID пользователя

    if (!title || !content) return res.status(400).send('Title and content are required');

    try {
        // Создание записи в базе данных
        const newPage = await Page.create({ title, content, createdBy });
        res.status(201).json({ id: newPage.id, title: newPage.title });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating page');
    }
});

// DELETE: Удаление страницы по ID
router.delete('/:id', verifyToken, checkRole('admin'), async (req, res) => {
    const pageId = req.params.id;

    try {
        const page = await Page.findByPk(pageId);
        if (!page) return res.status(404).send('Page not found');

        await page.destroy();
        console.log(`Page ${pageId} deleted from database.`);
        res.status(200).json({ response: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting page');
    }
});

// GET: Чтение страницы по ID
router.get('/:id', async (req, res) => {
    const pageId = req.params.id;

    try {
        const page = await Page.findByPk(pageId);
        if (!page) return res.status(404).send('Page not found');

        res.status(200).json(page);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error reading page');
    }
});

// GET: Список всех страниц
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
