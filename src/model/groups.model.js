const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../DB/database');

class Groups extends Model {}
Groups.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'groups' });

module.exports = Groups;
