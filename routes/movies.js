const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

router.get("/addMovie", (req, res) => {
    res.render("/addMovie", {
        errors: null,
        movieData: null,
    });
});

router.post("/add", async (req, res) => {
    const { name, description, year, genres, rating, director } = req.body;
    const errors = [];

    if (!name) errors.push("Movie name is required");
    if (!description) errors.push("Description is required");
    if (!year) errors.push("Year is required");
    if (!genres) errors.push("Genres are required");
    if (!rating) errors.push("Rating is required");
    if (!director) errors.push("Director is required");

    if (errors.length > 0) {
        return res.render("addMovie", { errors });
    }

    const newMovie = new Movie({
        name,
        description,
        year,
        genres: genres.split(",").map((g) => g.trim()),
        rating,
        director,
        creatorId: "temp-user",
    });

    await newMovie.save();
    res.redirect(`/movies/${newMovie._id}`);
});

router.get("/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.render("details", { movie: null });
        }
        res.render("details", { movie });
    } catch (error) {
        res.render("details", { movie: null });
    }
});

router.get("/:id/edit", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.send("Movie not found");
        }

        res.render("edit", { movie, errors: null });
    } catch (err) {
        res.send("Error fetching movie");
    }
});

router.post("/:id/edit", async (req, res) => {
    const { name, description, year, genres, rating, director } = req.body;
    const errors = [];

    if (!name) errors.push("Movie name is required");
    if (!description) errors.push("Description is required");
    if (!year) errors.push("Year is required");
    if (!genres) errors.push("Genres are required");
    if (!rating) errors.push("Rating is required");
    if (!director) errors.push("Director is required");

    if (errors.length > 0) {
        return res.render("edit", {
            movie: { _id: req.params.id, ...req.body },
            errors,
        });
    }

    try {
        await Movie.findByIdAndUpdate(req.params.id, {
            name,
            description,
            year,
            genres: genres.split(",").map(g => g.trim()),
            rating,
            director
        });

        res.redirect(`/movies/${req.params.id}`);
    } catch (err) {
        res.send("Error updating movie");
    }
});


router.get("/", (req, res) => {
    res.send("Movie Index Page - List all movies here.");
});

module.exports = router;
