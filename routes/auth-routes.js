const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cookie = require('cookie'); // Import the cookie package
require('dotenv').config();

const app = express();

// Express Middleware
app.use(session({
    secret: 'whateveryouwanttododotitidk',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser()); // Use cookie-parser middleware

// ... (Other middleware)

// Replace with a strong, random secret for signing JWT tokens
const jwtSecret = 'your-jwt-secret';

// Passport Setup
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
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
    res.redirect('https://testmindsai.tech');
};

app.set("trust proxy", 1);

// Generate JWT token
const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.emails[0].value,
    };
    const options = {
        expiresIn: '1h',
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
    passport.authenticate('google', { failureRedirect: 'https://testmindsai.tech/' }),
    (req, res) => {
        console.log("success auth");
        // Successful authentication, generate JWT token and send it to the client
        const token = generateToken(req.user);
        console.log(token);

        // Use the cookie.serialize method from the cookie package
        res.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
            path: '/',
            httpOnly: true,
        }));

        res.redirect('https://testmindsai.tech/');
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
            // Clear the authToken cookie using cookie.serialize
            res.setHeader('Set-Cookie', cookie.serialize('authToken', '', {
                path: '/',
                expires: new Date(0),
                httpOnly: true,
            }));
            res.redirect('https://testmindsai.tech/quizzes');
        }
    });
});

module.exports = app;
