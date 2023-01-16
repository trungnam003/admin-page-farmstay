'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupHasRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {Group, Role} = models;
      GroupHasRole.belongsTo(Group, {
        foreignKey: {name: 'group_id'},
        targetKey: 'id',
        as: 'group'
      });
      GroupHasRole.belongsTo(Role, {
        foreignKey: {name: 'role_id'},
        targetKey: 'id',
        as: 'role'
      })
    }
  }
  GroupHasRole.init({
    group_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      
    },
    role_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
     
    },
  }, {
    sequelize,
    modelName: 'GroupHasRole',
    tableName: 'group_has_roles',
    timestamps: false
  });
  return GroupHasRole;
};