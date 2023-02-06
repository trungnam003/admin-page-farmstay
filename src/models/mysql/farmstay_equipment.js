'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FarmstayEquipment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const {Farmstay,Equipment} = models;
      
      FarmstayEquipment.belongsTo(Farmstay, 
        {foreignKey: {name: 'farm_id'}, 
        targetKey:'id', 
        as:'used_by', 
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE'
      });

      FarmstayEquipment.belongsTo(Equipment, 
        {foreignKey: {name: 'equipment_id'},
        targetKey:'id', 
        as:'is_equipment', 
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE'
      });
      
    }
  }
  FarmstayEquipment.init({
    farm_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    equipment_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    quantity_used:{
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'FarmstayEquipment',
    tableName: 'farmstay_equipments',
    timestamps: false
  });
  return FarmstayEquipment;
};