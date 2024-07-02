// middleware/checkRole.js
module.exports = function(role) {
    return function(req, res, next) {
        console.log('Check role:', req.user ? req.user.role : null);
      if (req.user.role === role) {
        return next();
      } else {
        res.status(403).send('Forbidden');
      }
    };
  };
  