const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
  const { username, password} = req.body;
  try {
    const user = await User.create({ username, password ,role:"user"});
    res.redirect('/auth/login');
  } catch (err) {
    res.redirect('/auth/register');
  }
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
}));

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/auth/login');
  });
});

module.exports = router;
