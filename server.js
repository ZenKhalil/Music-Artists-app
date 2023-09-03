

const express = require('express');
const cors = require('cors');
const artists = require('./artists.json');

const app = express();
const port = 3000;

app.use(cors());

app.get('/artists', (req, res) => {
    res.json(artists);
});

app.get('/artists/:id', (req, res) => {
    const artistId = parseInt(req.params.id, 10);
    const artist = artists.find(a => a.id === artistId);
    if (artist) {
        res.json(artist);
    } else {
        res.status(404).json({ error: "Artist not found" });
    }
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
