const models = require("../models");

const { validationResult, check } = require("express-validator");

const { pageLimit: limit } = require("../config/app.config");

module.exports = (app) => {
  app.get("/api/item/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await models.Item.findByPk(id);
      res.status(200).json(item);
    } catch (error) {
      console.error(error);
      const { name, message } = error;
      res.status(400).json({ error: true, name, message }).end();
    }
  });

  app.get("/api/items/:pageNo/:orderBy", async (req, res) => {
    try {
      let { pageNo, orderBy } = req.params;
      if (!pageNo || !Number(pageNo)) pageNo = 1;
      const offset = (Number(pageNo) - 1) * limit;
      const items = await models.Item.findAll({
        offset,
        limit,
        order: [
          orderBy.toLowerCase() === "asc"
            ? ["price", "ASC"]
            : ["price", "DESC"],
        ],
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

  app.get("/api/items/:pageNo?", async (req, res) => {
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
      check("quantity").exists().isNumeric(),
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
        const {
          name,
          description,
          vendor,
          price,
          quantity,
          releaseDate,
        } = req.body;
        const newItem = await models.Item.create({
          name,
          description,
          vendor,
          price,
          quantity,
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

  app.patch(
    "/api/items",
    [
      check("id").isNumeric(),
      check("name").optional().isString(),
      check("description").optional().isString(),
      check("vendor").optional().isString(),
      check("price").optional().isNumeric(),
      check("quantity").optional().isNumeric(),
      check("releaseDate").optional().isDate(),
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const {
          id,
          name,
          description,
          vendor,
          price,
          quantity,
          releaseDate,
        } = req.body;
        const updateResult = await models.Item.update(
          {
            name,
            description,
            vendor,
            price,
            quantity,
            releaseDate,
          },
          {
            where: {
              id,
            },
          }
        );

        return res.status(204).end();
      } catch (error) {
        console.error(error);
        const { name, message } = error;
        res.status(400).json({ error: true, name, message }).end();
      }
    }
  );

  app.delete("/api/items/:id", async (req, res) => {
    try {
      let { id } = req.params;
      id = Number(id);
      const deleteResult = await models.Item.destroy({
        where: {
          id,
        },
      });
      return res.status(204).end();
    } catch (error) {
      console.error(error);
      const { name, message } = error;
      res.status(400).json({ error: true, name, message }).end();
    }
  });
};
