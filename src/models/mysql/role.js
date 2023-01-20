'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {GroupHasRole, RoleHasPermission} = models;
      Role.hasMany(GroupHasRole, {
        foreignKey: {name: 'role_id'},
        sourceKey: 'id',
        as: 'roles_with_groups'
      });
      Role.hasMany(RoleHasPermission, {
        foreignKey: {name: 'role_id'},
        sourceKey: 'id',
        as: 'role_has_permissions'
      })
    }
  }
  Role.init({
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
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    piority:{
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    paranoid: true
  });
  return Role;
};