const LocalStrategy = require('passport-local').Strategy;
const db = require('../config/database');
const { user: User } = db;
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

module.exports = function(passport) {
  passport.use(new LocalStrategy(
      {
        usernameField: 'identifier',
        passwordField: 'password'
      },
      async function(identifier, password, done) {
        try {
          const user = await User.findOne({
            where: {
              [Op.or]: [{ username: identifier }, { email: identifier }] // Поиск по логину или email
            }
          });

          if (!user) {
            return done(null, false, { message: 'Incorrect username or email.' });
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
