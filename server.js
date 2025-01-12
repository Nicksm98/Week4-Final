// filepath: /c:/Users/Nick/OneDrive/Desktop/Week4 FInal/server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

const apiKey = 'c88be850'; // Keep your API key secure

app.use(express.static('public')); // Serve static files from the 'public' directory

app.get('/search', async (req, res) => {
    const { query, type, page } = req.query;
    let url = `http://www.omdbapi.com/?apikey=${apiKey}`;

    switch (type) {
        case 'title':
            url += `&s=${query}&page=${page}`;
            break;
        case 'year':
            url += `&y=${query}&type=movie&page=${page}`;
            break;
        case 'id':
            url += `&i=${query}`;
            break;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching results.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});