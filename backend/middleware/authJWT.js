// middleware/authJWT.js
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { user: User } = db;

module.exports = async (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }

    try {
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).send({ message: 'User not found!' });
      }

      req.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(500).send({ message: 'Error verifying token' });
    }
  });
};
