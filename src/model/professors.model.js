const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../DB/database');

class Professors extends Model {}
Professors.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'professors' });

module.exports = Professors;
