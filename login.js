import express from 'express';

const loginRouter = express.Router();

const ADMIN_PASSWORD = '124578'; // Erstat med dit ønskede kodeord

loginRouter.post('/', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        // Login successful
        // Her kan du generere en token eller oprette en session, afhængig af dine præferencer
        res.json({ success: true, message: 'Logged in successfully' });
    } else {
        // Login failed
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

export default loginRouter;
