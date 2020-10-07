const models = require("../models");

const { validationResult, check } = require("express-validator");

const authentication = require("../utils/authentication");

module.exports = (app) => {
  app.get("/api/cart/", authentication, async (req, res) => {
    try {
      const { id: userId } = res.locals.payload;
      const cart = await models.Cart.findOne({
        where: {
          userId,
        },
        include: {
          model: models.CartItem,
          include: models.Item,
        },
      });

      return res.status(200).json(cart).end();
    } catch (error) {
      console.error(error);
      const { name, message } = error;
      res.status(400).json({ error: true, name, message }).end();
    }
  });
  app.post("/api/cart/add", authentication, async (req, res) => {
    try {
      let { items } = req.body;
      const { id: userId } = res.locals.payload;
      let cart = await models.Cart.findOne({
        where: {
          userId,
        },
      });

      if (!cart) {
        cart = await models.Cart.create({
          userId,
        });
      }
      const cartId = cart.dataValues.id;
      items.forEach((item) => {
        item.cartId = cartId;
      });
      const cartItems = await models.CartItem.bulkCreate(items);
      const userCart = {
        cartId,
        items,
      };
      res.status(201).json(userCart);
    } catch (error) {
      console.error(error);
      const { name, message } = error;
      res.status(400).json({ error: true, name, message }).end();
    }
  });

  app.post("/api/cart/remove", authentication, async (req, res) => {
    try {
      let { itemIds } = req.body;
      const { id: userId } = res.locals.payload;
      let cart = await models.Cart.findOne({
        where: {
          userId,
        },
      });

      if (!cart) {
        return res
          .status(400)
          .json({
            error: true,
            name: "Cart does not exist",
            message: "The cart you specified does not exist",
          })
          .end();
      }
      const cartId = cart.dataValues.id;
      const items = await models.CartItem.destroy({
        where: {
          cartId,
          itemId: itemIds,
        },
      });

      res.status(200).end();
    } catch (error) {
      console.error(error);
      const { name, message } = error;
      res.status(400).json({ error: true, name, message }).end();
    }
  });

  app.get("/api/cart/items", authentication, async (req, res) => {
    try {
      const { id: userId } = res.locals.payload;
      const cart = await models.Cart.findOne({
        where: {
          userId,
        },
      });
      if (!cart) return res.status(200).send(null);
      const cartItems = await models.CartItem.findAll({
        where: {
          cartId: cart.dataValues.id,
        },
      });

      return res.status(200).json(cartItems).end();
    } catch (error) {
      console.error(error);
      const { name, message } = error;
      res.status(400).json({ error: true, name, message }).end();
    }
  });
};
