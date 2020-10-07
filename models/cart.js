"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        targetKey: "id",
      });

      Cart.hasMany(models.CartItem, {
        foreignKey: {
          name: "cartId",
          allowNull: false,
        },
      });
    }
  }
  Cart.init(
    {
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );
  return Cart;
};
