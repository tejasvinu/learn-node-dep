const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const cors = require('cors');

app.use(session({
    secret: 'whateveryouwanttododotitidk', // Replace with a strong, random string
    resave: true,
    saveUninitialized: true,
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', 'https://testmindsai.tech');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
const corsOptions = {
    origin: 'https://testmindsai.tech',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session());
const jwtSecret = process.env.JWT_SECRET;

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    (accessToken, refreshToken, profile, done) => {
        // Use the profile information to check if the user is already registered in your database
        // If not, save the user's information to the database
        return done(null, profile);
    }));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('https://testmindsai.tech');
};

const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.emails[0].value,
        // Add more user information as needed
    };
    const options = {
        expiresIn: '1h', // Set the expiration time as needed
    };

    return jwt.sign(payload, jwtSecret, options);
};

// Initiate Google authentication from the server
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle the Google callback after successful authentication
app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'https://testmindsai.tech/' }),
    (req, res) => {
        console.log("success auth");
        const token = generateToken(req.user);
        console.log(token);

        // Redirect the user back to the frontend with the token
        res.redirect(`https://testmindsai.tech?token=${token}`);
    }
);

app.get('/profile', ensureAuthenticated, (req, res) => {
    const user = req.user;
    res.json({ user });
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error logging out:', err);
        } else {
            res.redirect('https://testmindsai.tech/quizzes');
        }
    });
});

module.exports = app;
