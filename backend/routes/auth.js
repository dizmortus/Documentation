const express = require('express');
const router = express.Router();
const passport = require('passport');
const db= require('../config/database')
const {user:User, refreshToken: RefreshToken }= db;
const jwt = require('jsonwebtoken');

router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
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
    if (!user) return res.status(401).json({ error: info.message });
    
    req.login(user, async err => {
      if (err) return next(err);

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET,{
        expiresIn: +process.env.JWT_EXPIRATION
      });
      let refreshToken =await RefreshToken.createToken(user);
      
      return res.json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          accessToken: token,
          refreshToken: refreshToken,
        }
      });
    });
  })(req, res, next);
});
router.post('/refreshToken',  async (req, res,next) => {
  const { refreshToken: requestToken } = req.body;
  
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }
  
  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });
    
    

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }
    
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }
    
    const user = await refreshToken.getUser();
    
    let newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRATION,
    });
    
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    
    return res.status(500).send({ message: err });
  }
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
