const express = require('express');
const router = express.Router();

// GET dashboard
router.get('/', (req, res) => {
    res.json({
        message: 'Dashboard route working',
        status: 'success'
    });
});

// Example stats route
router.get('/stats', (req, res) => {
    res.json({
        users: 10,
        games: 25,
        rentals: 5
    });
});

module.exports = router;