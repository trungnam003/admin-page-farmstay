'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class protectedAdmin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  protectedAdmin.init({
    adminId: {
      type:'BINARY(16)',
      primaryKey: true,
      allowNull: false,
    },
    isSuperAdmin: {type: DataTypes.BOOLEAN, allowNull: false,}
  }, {
    sequelize,
    modelName: 'protectedAdmin',
  });
  return protectedAdmin;
};