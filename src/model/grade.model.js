const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../DB/database");

class Grade extends Model {}
Grade.init(
  {
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: "Student", key: "student_code" },
    },
    finalGrade: { type: DataTypes.DECIMAL, allowNull: false },
    speaking: { type: DataTypes.INTEGER, allowNull: false },
    listening: { type: DataTypes.INTEGER, allowNull: false },
    reading: { type: DataTypes.INTEGER, allowNull: false },
    writing: { type: DataTypes.INTEGER, allowNull: false },
    englishtest: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Grade", tableName: "Grade", timestamps: true }
);

module.exports = Grade;
