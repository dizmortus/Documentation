const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

/**
 * Configures the passport middleware with the LocalStrategy and serialization/deserialization functions.
 *
 * @param {Object} passport - The passport object.
 * @return {void}
 */
module.exports = function(passport) {
  passport.use(new LocalStrategy(
    async function(username, password, done) {
      try {
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
