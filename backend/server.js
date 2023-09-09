import express from 'express';
import cors from 'cors';
import path from 'path';
import artistRoutes from './routes.js';

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('frontend')); // This serves files from the "frontend" directory

// Mounting the artist routes
app.use('/', artistRoutes);

// Always return the main index.html, so the client-side router can take over for SPA behavior
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
