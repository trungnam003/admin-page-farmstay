'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {GroupHasRole, User} = models;
      Group.hasMany(GroupHasRole, {
        foreignKey: {name: 'group_id'},
        sourceKey: 'id',
        as: 'group_roles'
      });
      Group.hasMany(User, {
        foreignKey: {name: 'group_id'},
        sourceKey: 'id',
        as: 'group_has_users'
      });
    }
  }
  Group.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Group',
    tableName: 'groups',
    paranoid: true
  });
  return Group;
};