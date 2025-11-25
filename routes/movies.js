const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie'); 

router.get('/', (req, res) => {
    res.send('Movie Index Page - List all movies here.');
});

router.get('/add', (req, res) => {
    res.send('Add New Movie Form');
});

module.exports = router;