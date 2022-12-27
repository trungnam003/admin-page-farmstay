'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProtectedAdmin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProtectedAdmin.belongsTo(models.AdminUser, {foreignKey: {name: 'admin_id'}, targetKey :'user_id', as: 'protected_admin'})
    }
  }
  ProtectedAdmin.init({
    admin_id: {
      type:'BINARY(16)',
      primaryKey: true,
      allowNull: false,
    },
    is_super_admin: {type: DataTypes.BOOLEAN, allowNull: false,}
  }, {
    sequelize,
    modelName: 'ProtectedAdmin',
    tableName: 'protected_admins'
  });
  return ProtectedAdmin;
};