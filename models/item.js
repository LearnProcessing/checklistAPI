'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Item.belongsTo(models.Checklist)
    }
  };
  Item.init({
    ChecklistId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Checklists',
        key: 'id'
      }
    },
    description: DataTypes.STRING,
    is_completed: DataTypes.BOOLEAN,
    completed_at: DataTypes.DATE,
    due: DataTypes.STRING,
    urgency: DataTypes.INTEGER,
    updated_by: DataTypes.STRING,
    assignee_id: DataTypes.STRING,
    task_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};