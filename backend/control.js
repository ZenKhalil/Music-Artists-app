import artists from './artists.json' assert { type: "json" };

export function getAllArtists(req, res) {
    console.log("Inside getAllArtists");
    res.json(artists);
}

export function getArtistById(req, res) {
    const artistId = parseInt(req.params.id, 10);
    const artist = artists.find(a => a.id === artistId);
    if (artist) {
        res.json(artist);
    } else {
        res.status(404).json({ error: "Artist not found" });
    }
}

export function createArtist(req, res) {
    const newArtist = req.body;
    newArtist.id = Math.max(...artists.map(a => a.id)) + 1;
    artists.push(newArtist);
    res.status(201).json(newArtist);
}

export function updateArtist(req, res) {
    const artistId = parseInt(req.params.id, 10);
    const updatedArtist = req.body;
    const artistIndex = artists.findIndex(a => a.id === artistId);

    if (artistIndex !== -1) {
        artists[artistIndex] = updatedArtist;
        res.json(updatedArtist);
    } else {
        res.status(404).json({ error: "Artist not found" });
    }
}

export function deleteArtist(req, res) {
    const artistId = parseInt(req.params.id, 10);
    const artistIndex = artists.findIndex(a => a.id === artistId);

    if (artistIndex !== -1) {
        artists.splice(artistIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: "Artist not found" });
    }
}

export function adminLogin(req, res) {
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "password123";
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
}
