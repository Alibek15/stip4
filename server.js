const express = require('express');
const session = require('express-session');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT;
const path = require('path');
const {QuizQuestionModel} = require('./model/quiz');

// Connect to MongoDB Atlas
mongoose.connect(process.env.mongoURI);
const db = mongoose.connection;
const { Types: { ObjectId } } = require('mongoose');

// Middleware for session management
app.use(session ({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

async function fetchExchangeRates(req, res, next) {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    const rates = data.rates;
    const currencies = Object.keys(rates).slice(0, 5); // get the first 5 currencies
    res.locals.exchangeRates = currencies.map(currency => ({currency, rate: rates[currency]}));
    next();
}

app.use(fetchExchangeRates);

app.use(bodyParser.json());

// Middleware for parsing incoming request bodies
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use('/register', require('./routes/registerUser'));
app.use('/', require('./routes/login'));
app.use('/main', require('./routes/main'));
app.use('/admin', require('./routes/manage/admin'));
app.use('/adminPanel', require('./routes/manage/adminPanel'));
app.use('/nytimes', require('./routes/nytimes'));
app.use('/quizPass', require('./routes/quizPass'));


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.message || 'Something went wrong!');
});

// Logout route
app.all('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            // Redirect the user to the login page after logout
            res.redirect('/');
        }
    });
});
app.post('/submitQuiz', async (req, res) => {
    const userAnswers = req.body;
    const questions = await QuizQuestionModel.find({});

    let score = 0;

    for (let i = 0; i < questions.length; i++) {
        if (userAnswers['q' + i] == questions[i].correctAnswer) {
            score++;
        }
    }

    res.redirect('/results/' + score);
});

app.get('/results/:score', (req, res) => {
  const score = req.params.score;
  res.render('results', { score: score, user: req.user});
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});