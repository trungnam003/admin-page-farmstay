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
        as:'hired_by', 
        onDelete: 'SET NULL', 
        onUpdate: 'CASCADE'
      });

      FarmstayEquipment.belongsTo(Equipment, 
        {foreignKey: {name: 'equipment_id'},
        targetKey:'id', 
        as:'belong_to', 
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE'
      });
      
    }
  }
  FarmstayEquipment.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    
  }, {
    sequelize,
    modelName: 'FarmstayEquipment',
    tableName: 'farmstay_equipments',
    timestamps: false
  });
  return FarmstayEquipment;
};