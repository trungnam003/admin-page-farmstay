'use strict';
const { Buffer } = require('node:buffer');
const uuidBuffer = require('uuid-buffer');
const bcrypt = require('bcrypt')
const {HttpError, HttpError404} = require('../../utils/errors')
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
      AdminUser.hasOne(models.ProtectedAdmin, {foreignKey: {name: 'admin_id'},sourceKey :'user_id', as: 'protected_admin'})
    }

    
  }
  AdminUser.init({
    user_id: {
      type:'BINARY(16)',
      primaryKey: true,
      allowNull: false,
      // defaultValue: Buffer.from(uuid.parse(uuid.v4(), Buffer.alloc(16)), Buffer.alloc(16)),
    },
    user_uuid:{
      type: DataTypes.VIRTUAL,
      get() {
        const id = uuidBuffer.toString(this.user_id)
        return id;
      },
    },
    username: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z][A-Za-z0-9]*(?=[a-zA-Z0-9._]{3,120}$)(?!.*[_.]{2})[^_.].*[^_.]$/i,
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
    hashed_password: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2,100],
          msg: "Mật khẩu quá ngắn"
        }
      }
    },
    avatar_url:{
      type:DataTypes.STRING(512),
      allowNull: true
    },
    status: {
      type:DataTypes.STRING(16),
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'approved']],
          msg: "Giá trị phải là pending hoặc approved"
        },
      }

    },
    is_active: {
      type:DataTypes.BOOLEAN,
      defaultValue: false,
      
    },
    refesh_token: {
      type:DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'AdminUser',
    tableName: 'admin_users'
  });
  AdminUser.prototype.validatePassword = async function(password){
    try {
      const isAuth = await bcrypt.compare(password, this.hashed_password)
      return isAuth;
    } catch (error) {
      throw new HttpError(500)
    }
  }
  AdminUser.addHook('beforeCreate', async function(user, options){
    const salt = await bcrypt.genSalt(10);
    user.hashed_password = await bcrypt.hash(user.hashed_password, salt);
  })
  return AdminUser;
};