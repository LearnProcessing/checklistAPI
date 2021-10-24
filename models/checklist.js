'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Checklist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Checklist.hasMany(models.Item)
    }
  };
  Checklist.init({  
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.UUID,
    },
    object_domain: DataTypes.STRING,
    object_id: DataTypes.STRING,
    description: DataTypes.STRING,
    is_completed: DataTypes.BOOLEAN,
    completed_at: DataTypes.DATE,
    updated_by: DataTypes.STRING,
    due: DataTypes.STRING,
    urgency: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Checklist',
  });
  return Checklist;
};