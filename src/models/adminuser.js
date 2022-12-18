'use strict';
const { Buffer } = require('node:buffer');
var uuid = require('uuid');
const uuidBuffer = require('uuid-buffer');
const bcrypt = require('bcrypt')
const {HttpError, HttpError404} = require('../utils/errors')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AdminUser.init({
    userId: {
      type:'BINARY(16)',
      primaryKey: true,
      allowNull: false,
      defaultValue: Buffer.from(uuid.parse(uuid.v4(), Buffer.alloc(16)), Buffer.alloc(16)),
    
      
    },
    userUUID:{
      type: DataTypes.VIRTUAL,
      get() {
        const id = uuidBuffer.toString(this.userId)
        return id;
      },
    },
    username: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/i,
          msg: "Username không hợp lệ"
        }
      }
    },
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: "Email không hợp lệ"
        }
      }
    },
    hashpassword: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type:DataTypes.TEXT,
      allowNull: true,
    },
    refeshToken: {
      type:DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'AdminUser',
    
  });
  AdminUser.prototype.validatePassword = async function(password){
    try {
      const isAuth = await bcrypt.compare(password, this.hashpassword)
      return isAuth;
    } catch (error) {
      throw new HttpError(500)
    }
  }
  return AdminUser;
};