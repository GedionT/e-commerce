module.exports = (app) => {
  require("./controllers/items")(app);
  require("./controllers/user")(app);
  require("./controllers/cart")(app);
};
