const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

// only allow logged in users
function ensureLoggedIn(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    next();
}

router.get("/addMovie", ensureLoggedIn, (req, res) => {
    res.render("addMovie", {
        errors: null,
        movieData: null,
    });
});

router.post("/add", ensureLoggedIn, async (req, res) => {
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
        creatorId: req.session.user.id
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

        if (!req.session || !req.session.user) {
            return res.redirect("/login");
        }

        if (movie.creatorId.toString() !== req.session.user.id.toString()) {
            return res.status(403).send("You are not allowed to edit this movie");
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

    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.send("Movie not found");
        }

        if (!req.session || !req.session.user) {
            return res.redirect("/login");
        }

        if (movie.creatorId.toString() !== req.session.user.id.toString()) {
            return res.status(403).send("You are not allowed to edit this movie");
        }

        if (errors.length > 0) {
            return res.render("edit", {
                movie: { _id: req.params.id, ...req.body },
                errors,
            });
        }

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

router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render("moviesIndex", {movies});
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading movies");
    }
});

router.post("/:id/delete", ensureLoggedIn, async(req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if(!movie) {
            return res.send("Movie not found");
        }

        if (movie.creatorId.toString() !== req.session.user.id.toString()) {
            return res.status(403).send("You are not allowed to delete, must be signed in.");
        }

        await Movie.findByIdAndDelete(req.params.id);
        res.redirect("/movies");
    } catch (err) {
        console.error(err);
        res.status(500).send("error deleting movie.");
    }
});

module.exports = router;
