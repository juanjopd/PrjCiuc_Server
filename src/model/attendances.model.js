const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../DB/database');

class Attendances extends Model {}
Attendances.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
}, { sequelize, modelName: 'attendances' });

module.exports = Attendances;
