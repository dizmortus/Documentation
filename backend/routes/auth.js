const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("../config/database");
const { user: User, refreshToken: RefreshToken } = db;
const jwt = require("jsonwebtoken");

router.use(function (req, res, next) {
  res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/check-auth", async (req, res) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ message: "Unauthorized! Invalid token provided!" });
      }

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      return res.json({
        id: user.id,
        username: user.username,
        role: user.role,
      });
    });
  } catch (error) {
    console.error("Error checking authentication:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password, role: "user" });
    res.status(201).json(user);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: "Username or email already exists" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info.message });

    req.login(user, async (err) => {
      if (err) return next(err);

      const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: +process.env.JWT_EXPIRATION,
          }
      );
      let refreshToken = await RefreshToken.createToken(user);

      return res.json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          accessToken: token,
          refreshToken: refreshToken,
        },
      });
    });
  })(req, res, next);
});

router.post("/refreshToken", async (req, res, next) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: requestToken },
    });

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

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out" });
  });
});

router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
