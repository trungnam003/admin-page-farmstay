'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class administrative_units extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {provinces, districts, wards} = models;

      administrative_units.hasMany(provinces, {
        foreignKey: {name: 'administrative_unit_id'},
        sourceKey: 'id',
        as: 'provinces' 
      })

      administrative_units.hasMany(districts, {
        foreignKey: {name: 'administrative_unit_id'},
        sourceKey: 'id',
        as: 'districts' 
      })

      administrative_units.hasMany(wards, {
        foreignKey: {name: 'administrative_unit_id'},
        sourceKey: 'id',
        as: 'wards' 
      })

    }
  }
  administrative_units.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    full_name :{
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name_en :{
      type: DataTypes.STRING,
      allowNull: false,
    },
    short_name  :{
      type: DataTypes.STRING,
      allowNull: false,
    },
    short_name_en  :{
      type: DataTypes.STRING,
      allowNull: false,
    },
    code_name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    code_name_en:{
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'administrative_units',
    timestamps: false
  });
  return administrative_units;
};