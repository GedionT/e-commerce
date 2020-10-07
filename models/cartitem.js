"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CartItem.belongsTo(models.Cart, {
        foreignKey: {
          name: "cartId",
          allowNull: false,
        },
        targetKey: "id",
      });

      CartItem.belongsTo(models.Item, {
        foreignKey: {
          name: "itemId",
          allowNull: false,
        },
        targetKey: "id",
      });
    }
  }
  CartItem.init(
    {
      cartId: DataTypes.INTEGER,
      itemId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CartItem",
    }
  );
  return CartItem;
};
