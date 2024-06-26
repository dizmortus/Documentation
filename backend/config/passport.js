const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    done(null, token);
  });

  passport.deserializeUser(async function(token, done) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
