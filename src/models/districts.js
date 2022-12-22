'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class districts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {administrative_units, provinces, wards} = models
      districts.belongsTo(administrative_units, {
        foreignKey:{
          name: "administrative_unit_id",
        },
        targetKey: 'id',
        as: 'administrative_unit'
      });
      districts.belongsTo(provinces, {
        foreignKey:{
          name: "province_code"
        },
        targetKey: 'code',
        as: 'province',
      });

      districts.hasMany(wards, {
        foreignKey:{
          name: "district_code"
        },
        sourceKey: 'code',
        as: 'wards',
      });

    }
  }
  districts.init({
    code:{
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    name  :{
      type: DataTypes.STRING,
      allowNull: false,
    },
    name_en  :{
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name :{
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name_en :{
      type: DataTypes.STRING,
      allowNull: false,
    },
    code_name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'districts',
    timestamps: false
  });
  return districts;
};