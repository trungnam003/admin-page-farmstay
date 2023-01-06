'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    uuid:{
      type: 'BINARY(16)',
      allowNull: false,
      unique: true
    },
    username: {
      type: DataTypes.STRING(24),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    hashed_password: {
      type: DataTypes.CHAR(64),
      allowNull: false,
    },
    phone:{
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    gender:{
      type: DataTypes.ENUM('male', 'female', 'orther'),
      allowNull: true,
    },
    is_active:{
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    birthdate:{
      type: DataTypes.DATEONLY,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};