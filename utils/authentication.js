const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/app.config");
module.exports = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    try {
      const payload = await jwt.verify(bearerToken, JWT_KEY);
      if (!res.locals) res.locals = {};
      res.locals.payload = payload;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        error: true,
        name: "Unauthorized",
        message: "You are not authorized " + error.toString(),
      });
    }
  } else {
    res.status(401).json({
      error: true,
      name: "Token not found",
      message: "You have not provided a token",
    });
  }
};
