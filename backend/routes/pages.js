const express = require('express');
const db = require('../config/database');
const Page = db.page;
const verifyToken = require('../middleware/authJWT');
const checkRole = require('../middleware/checkRole');

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
    const pageId = req.params.id;

    if (!title || !content) return res.status(400).send('Title and content are required');

    try {
        const page = await Page.findByPk(pageId);
        if (!page) return res.status(404).send('Page not found');

        page.title = title;
        page.content = content;
        await page.save();

        res.status(200).json({ id: page.id, title: page.title, content: page.content });
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
