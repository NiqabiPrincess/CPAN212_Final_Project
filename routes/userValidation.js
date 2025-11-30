const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");


router.get("/register", (req, res) => {
    res.render("register", { errors: null });
});

router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");

    if (password && password.length < 4) {
        errors.push("Password must be at least 4 characters long");
    }

    if (errors.length > 0) {
        return res.render("register", { errors });
    }

    const existingUser = await Registration.findOne({ email });
    if (existingUser) {
        return res.render("register", { errors: ["Email already registered"] });
    }

    const newUser = new Registration({ email, password });
    await newUser.save();

    res.redirect("/login");
});

router.get("/login", (req, res) => {
    res.render("login", { errors: null });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");

    if (errors.length > 0) {
        return res.render("login", { errors });
    }

    const user = await Registration.findOne({ email });

    if (!user) {
        return res.render("login", { errors: ["Email not found"] });
    }

    if (user.password !== password) {
        return res.render("login", { errors: ["Incorrect password"] });
    }

    req.session.user = {
        id: user._id,
        email: user.email
    };

    res.redirect("/");
});

// Export router
module.exports = router;
