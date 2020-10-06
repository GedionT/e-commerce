const models = require("../models");

const { body, validationResult, check } = require("express-validator");

const { pageLimit: limit } = require("../config/app.config");

module.exports = (app) => {
  app.get("/api/items/:pageNo", async (req, res) => {
    try {
      let { pageNo } = req.params;
      if (!pageNo || !Number(pageNo)) pageNo = 1;
      const offset = (Number(pageNo) - 1) * limit;
      const items = await models.Item.findAll({
        offset,
        limit,
      });
      res.status(200).json({
        page: Number(pageNo),
        length: items.length,
        items,
      });
    } catch (error) {
      console.error(error);
      const { name, message } = error;
      res.status(400).json({ error: true, name, message }).end();
    }
  });

  app.post(
    "/api/items",
    [
      check("name").exists().isString(),
      check("price").exists().isNumeric(),
      check("description").optional().isString(),
      check("vendor").optional().isString(),
      check("releaseDate").optional().isDate(),
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { name, description, vendor, price, releaseDate } = req.body;
        const newItem = await models.Item.create({
          name,
          description,
          vendor,
          price,
          releaseDate,
        });

        return res.status(201).json(newItem).end();
      } catch (error) {
        console.error(error);
        const { name, message } = error;
        res.status(400).json({ error: true, name, message }).end();
      }
    }
  );
};
