const models = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SALT_LENGTH, JWT_KEY, JWT_OPTIONS } = require("../config/app.config");
const { validationResult, check } = require("express-validator");
module.exports = (app) => {
  app.post(
    "/api/user/register",
    [
      check("userName").exists().isString(),
      check("password").exists().isString(),
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { userName, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, SALT_LENGTH);
        const newUser = await models.User.create({
          userName,
          password: hashedPassword,
        });

        const token = jwt.sign({ userName }, JWT_KEY, JWT_OPTIONS);
        return res.status(200).json({ token });
      } catch (error) {
        console.error(error);
        const { name, message } = error;
        res.status(400).json({ error: true, name, message }).end();
      }
    }
  );

  app.post(
    "/api/user/login",
    [
      check("userName").exists().isString(),
      check("password").exists().isString(),
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { userName, password } = req.body;

        const user = await models.User.findOne({
          where: {
            userName,
          },
        });

        if (!user) {
          return res.status(400).end("Wrong user name or password");
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (!isCorrectPassword) {
          return res.status(400).end("Wrong user name or password");
        }

        const token = jwt.sign({ userName }, JWT_KEY, JWT_OPTIONS);
        return res.status(200).json({ token });
      } catch (error) {
        console.error(error);
        const { name, message } = error;
        res.status(400).json({ error: true, name, message }).end();
      }
    }
  );
};
