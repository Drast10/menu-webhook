'use strict';
module.exports = (sequelize, DataTypes) => {
  const menu = sequelize.define('menu', {
    day: DataTypes.String,
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