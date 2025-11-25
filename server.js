const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const DB_URI = 'mongodb+srv://dbUser:dbUser@cluster0.1oqhg7m.mongodb.net/?appName=Cluster0';
const movieRouter = require('./routes/movies');

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use('/movies', movieRouter);

app.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to the Movie Database' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

mongoose.connect(DB_URI)
    .then(() => console.log('✅ MongoDB connected successfully.'))
    .catch(err => console.error('❌ MongoDB connection error:', err));