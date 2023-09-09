import express from 'express';
import * as artistControllers from './control.js';

const router = express.Router();

// Admin login route
router.post('/admin-login', artistControllers.adminLogin);

// CRUD for artists
router.get('/artists', artistControllers.getAllArtists);
router.get('/artists/:id', artistControllers.getArtistById);
router.post('/artists', artistControllers.createArtist);
router.put('/artists/:id', artistControllers.updateArtist);
router.delete('/artists/:id', artistControllers.deleteArtist);

export default router;
