// // passport-setup.js
// require('dotenv').config();
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/user');

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     console.error('Error deserializing user:', error);
//     done(error, null);
//   }
// });

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: process.env.CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ googleId: profile.id });

//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         const newUser = await new User({
//           googleId: profile.id,
//           displayName: profile.displayName,
//           email: profile.emails[0].value,
//           // Add other fields as needed
//         }).save();

//         done(null, newUser);
//       } catch (error) {
//         console.error('Error during Google authentication:', error);
//         done(error, null);
//       }
//     }
//   )
// );

// module.exports = passport;
