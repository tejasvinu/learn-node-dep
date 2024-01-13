const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect('mongodb+srv://tejasvinu:HRvEphb6CKgeWBYf@aperta.u4lsf.mongodb.net/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true });

// Express Middleware
app.use(session({
    secret: 'whateveryouwanttododotitidk', // Replace with a strong, random string
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Replace with a strong, random secret for signing JWT tokens
const jwtSecret = 'your-jwt-secret';

// Passport Setup
passport.use(new GoogleStrategy({
    clientID: '654317944738-3vdifm0pk5eue7si4dgt93cg07s37sqa.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback'
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

// Custom middleware to check if the user is authenticated
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('http://localhost:5173/');
};

// Generate JWT token
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

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/' }),
    (req, res) => {
        // Successful authentication, generate JWT token and send it to the client
        const token = generateToken(req.user);
        res.cookie('authToken', token);
        res.redirect('http://localhost:5173/quizzes');
    }
);

app.get('/profile', ensureAuthenticated, (req, res) => {
    // Access user profile information from the session
    const user = req.user;
    res.json({ user });
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error logging out:', err);
            // Handle errors appropriately, e.g., return a 500 status code
        } else {
            res.clearCookie('jwt');
            res.redirect('http://localhost:5173/');
        }
    });
});

module.exports = app;