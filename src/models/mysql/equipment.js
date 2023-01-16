'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Equipment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {FarmstayEquipment, Category} = models;
      Equipment.hasMany(FarmstayEquipment, 
        {foreignKey: {name: 'equipment_id', },
        sourceKey:'id', 
        as:'equipments'
      });
      Equipment.belongsTo(Category,
        {
          foreignKey: {name: 'category_id', },
          targetKey: 'id',
          as: 'category',
          onDelete: 'SET NULL',
          onUpdate: 'SET NULL',
        }
      );
    }
  }
  Equipment.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rent_cost: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    total_rented: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    category_id:{
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      
    },
  }, {
    sequelize,
    modelName: 'Equipment',
    tableName: 'equipments',
    paranoid: true,
  });
  return Equipment;
};