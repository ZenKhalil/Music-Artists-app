import express from 'express';
import cors from 'cors';
import artists from './artists.json' assert { type: "json" };

const app = express();
const port = 3000;
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123";

app.use(cors());
app.use(express.json());

// Rest of your routes...

// Login route
// Check admin credentials
app.post('/admin-login', (req, res) => {
    console.log("Received:", req.body);  // Add this line

    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });  // Added a status code here
    }
});

// 1. Læs alle kunstnere
app.get('/artists', (req, res) => {
    res.json(artists);
});

// 2. Læs en specifik kunstner baseret på ID
app.get('/artists/:id', (req, res) => {
    const artistId = parseInt(req.params.id, 10);
    const artist = artists.find(a => a.id === artistId);
    if (artist) {
        res.json(artist);
    } else {
        res.status(404).json({ error: "Artist not found" });
    }
});

// 3. Opret en ny kunstner
app.post('/artists', (req, res) => {
    const newArtist = req.body;
    newArtist.id = Math.max(...artists.map(a => a.id)) + 1; // Tilføjer et nyt unikt ID
    artists.push(newArtist);
    res.status(201).json(newArtist);
});

// 4. Opdater en kunstner
app.put('/artists/:id', (req, res) => {
    const artistId = parseInt(req.params.id, 10);
    const updatedArtist = req.body;
    const artistIndex = artists.findIndex(a => a.id === artistId);
    
    if (artistIndex !== -1) {
        artists[artistIndex] = updatedArtist;
        res.json(updatedArtist);
    } else {
        res.status(404).json({ error: "Artist not found" });
    }
});

// 5. Slet en kunstner
app.delete('/artists/:id', (req, res) => {
    const artistId = parseInt(req.params.id, 10);
    const artistIndex = artists.findIndex(a => a.id === artistId);
    
    if (artistIndex !== -1) {
        artists.splice(artistIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: "Artist not found" });
    }
});

// Start serveren
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
