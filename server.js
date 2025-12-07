const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const DB_URI = process.env.MONGODB_URI || 'mongodb+srv://dbUser:dbUser@cluster0.1oqhg7m.mongodb.net/?appName=Cluster0';

const movieRouter = require('./routes/movies');
const userValidationRouter = require('./routes/userValidation');

const session = require("express-session");

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "cpan212",
    resave: false,
    saveUninitialized: true,
    cookie: {},
}));

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use('/', userValidationRouter);
app.use('/movies', movieRouter);

app.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to the Movie Database' });
});

mongoose.connect(DB_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
