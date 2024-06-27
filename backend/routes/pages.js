const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db =require('../config/database')
const Page = db.page
const verifyToken = require('../middleware/authJWT');
const checkRole = require('../middleware/checkRole');

const router = express.Router();
const pagesDir = path.join(__dirname, '..', 'pages');

// POST: Создание новой страницы
router.post('/',verifyToken,checkRole('admin'), async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).send('Title and content are required');

    try {
        // Создание записи в базе данных и получение её ID
        const newPage = await Page.create({});
        const pageId = newPage.id;
        const newPagePath = path.join(pagesDir, `${pageId}.html`);

        const pageContent = `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <link rel="stylesheet" href="styles.css">
      </head>
      <body>
          ${content}
      </body>
      </html>
    `;

        // Создание файла с полученным ID
        await fs.writeFile(newPagePath, pageContent);
        console.log(`Page ${pageId} created and saved to ${newPagePath}.`);

        res.status(201).json({ id: pageId, title });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating page');
    }
});

// DELETE: Удаление страницы по ID
router.delete('/:id',verifyToken,checkRole('admin'), async (req, res) => {
    const pageId = req.params.id;
    const pagePath = path.join(pagesDir, `${pageId}.html`);

    try {
        await fs.unlink(pagePath);
        await Page.destroy({ where: { id: pageId } }); // Удаление записи из базы данных после успешного удаления страницы
        console.log(`Page ${pageId} deleted from database.`);
        res.status(200).json({ response: 'success' });
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).send('Page not found');
        }
        console.error(err);
        res.status(500).send('Error deleting page');
    }
});

// GET: Чтение страницы по ID
router.get('/:id', async (req, res) => {
    const pageId = req.params.id;
    const pagePath = path.join(pagesDir, `${pageId}.html`);

    try {
        const content = await fs.readFile(pagePath, 'utf8');
        res.setHeader('Content-Type', 'text/html');
        res.send(content);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).send('Page not found');
        }
        console.error(err);
        res.status(500).send('Error reading page');
    }
});

// GET: Список всех страниц
router.get('/', async (req, res) => {
    try {
        const files = await fs.readdir(pagesDir);
        const pages = await Promise.all(files.map(async (file) => {
            const content = await fs.readFile(path.join(pagesDir, file), 'utf8');
            const title = content.match(/<title>(.*?)<\/title>/)?.[1] || path.basename(file, '.html');
            return { id: path.basename(file, '.html'), title };
        }));
        res.json(pages);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving pages');
    }
});

module.exports = router;
