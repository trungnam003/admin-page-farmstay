'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApiEndpoint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {Permission} = models;
      ApiEndpoint.hasMany(Permission, {
        foreignKey: {name: 'api_endpoint_id'},
        sourceKey: 'id',
        as: 'endpoint_permissions'
      })
      ApiEndpoint.hasMany(ApiEndpoint, {
        foreignKey:{name: 'parent_id'},
         sourceKey: 'id',
         as: 'childs'
      })
      ApiEndpoint.belongsTo(ApiEndpoint, {
        foreignKey:{name: 'parent_id', allowNull: true},
         targetKey: 'id',
         as: 'parent'
      })
    }
  }
  ApiEndpoint.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED
    },
    parent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    api_endpoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'ApiEndpoint',
    tableName: 'api_endpoints',
    paranoid: true
  });
  return ApiEndpoint;
};