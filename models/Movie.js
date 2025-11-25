const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Movie name is required.'],
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        min: [1888, 'Year must be after 1888'], 
        max: [new Date().getFullYear() + 5, 'Year is out of range'],
        required: true
    },
    genres: {
        type: [String], 
        default: []
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
        required: true
    },
    director: {
        type: String,
        trim: true
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true 
    }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;