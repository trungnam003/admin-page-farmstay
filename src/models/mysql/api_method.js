'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApiMethod extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {Permission} = models;
      ApiMethod.hasMany(Permission, {
        foreignKey: {name: 'api_method_id'},
        sourceKey: 'id',
        as: 'method_permissions'
      })
    }
  }
  ApiMethod.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED
    },
    value: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'ApiMethod',
    tableName: 'api_methods',
    paranoid: true,
  });
  return ApiMethod;
};