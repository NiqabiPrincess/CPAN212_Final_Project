const Registration = require("../models/Registration");
const express = require("express");
const router = express.Router();

router.get("/register", (req, res) => {
    res.render("register", { errors: null });
});

router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");

    if (password && password.length < 4) {
        errors.push("Password must be at least 4 characters");
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

module.exports = router;
