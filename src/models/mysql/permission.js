'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {RoleHasPermission, ApiMethod, ApiEndpoint} = models;
      Permission.hasMany(RoleHasPermission, {
        foreignKey: {name: 'permission_id'},
        sourceKey: 'id',
        as: 'roles'
      })

      Permission.belongsTo(ApiMethod, {
        foreignKey: {name: 'api_method_id'},
        targetKey: 'id',
        as: 'method'
      })
      Permission.belongsTo(ApiEndpoint, {
        foreignKey: {name: 'api_endpoint_id'},
        targetKey: 'id',
        as: 'api_endpoint'
      })
    }
  }
  Permission.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    api_method_id:{
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
     
    },
    api_endpoint_id:{
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      
    },
  }, {
    sequelize,
    modelName: 'Permission',
    tableName: 'permissions',
    paranoid: true
  });
  return Permission;
};