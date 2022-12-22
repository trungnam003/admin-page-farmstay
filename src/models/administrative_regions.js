'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class administrative_regions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  administrative_regions.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    name_en:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    code_name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    code_name_en:{
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'administrative_regions',
    timestamps: false
  });
  return administrative_regions;
};