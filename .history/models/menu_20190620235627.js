'use strict';
module.exports = (sequelize, DataTypes) => {
  const menus = sequelize.define('menus', {
    day: DataTypes.STRING,
    dish: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    underscored: true,
  });
  menu.associate = function(models) {
    // associations can be defined here
  };
  return menu;
};