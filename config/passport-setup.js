const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const dotenv = require('dotenv');
const User = require('../models/userModel');

dotenv.config({ path: './config.env' });

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

passport.use(
  new GoogleStrategy(
    {
      //options for the google strategy
      callbackURL: '/api/v1/users/loginGoogle/redirect',
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET
    },
    (accessToken, refreshToken, profile, done) => {
      //passport callback function
      handleGoogleProfileData(profile).then(userObj => {
        // console.log('User:', userObj);
        done(null, userObj);
      });
    }
  )
);

async function handleGoogleProfileData(profile) {
  const user = await User.findOne({ googleId: profile.id });
  if (user) {
    return user;
  } else {
    const currentUser = await new User({
      name: profile.displayName,
      googleId: profile.id,
      thumbnail: profile._json.picture
    }).save();
    return currentUser;
  }
}
