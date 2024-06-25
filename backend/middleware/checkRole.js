// middleware/checkRole.js
module.exports = function(role) {
    return function(req, res, next) {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      } else {
        res.status(403).send('Forbidden');
      }
    };
  };
  