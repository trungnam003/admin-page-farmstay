'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class wards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {administrative_units, districts} = models

      wards.belongsTo(administrative_units, {
        foreignKey:{
          name: "administrative_unit_id"
        },
        targetKey: 'id',
        as: 'administrative_unit'
      });

      wards.belongsTo(districts, {
        foreignKey:{
          name: "district_code"
        },
        targetKey: 'code',
        as: 'district',
      });

    }
  }
  wards.init({
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
    modelName: 'wards',
    timestamps: false
  });
  return wards;
};