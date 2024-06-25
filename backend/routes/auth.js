const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password,role:"user" });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(418).json({ error: info.message });
    req.login(user, err => {
      if (err) return next(err);
      return res.json(user);
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.json({ message: 'Logged out' });
  });
});
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});
module.exports = router;
