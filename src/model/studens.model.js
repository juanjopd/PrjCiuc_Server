const { sequelize, Model, DataTypes } = require("../DB/database");

class Student extends Model {}

Student.init(
  {
    student_code: {
      type: DataTypes.INTEGER,
    },
    student_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    student_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    couse_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    payment: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    carrerProgram: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gradeHistory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Student",
  }
);

module.exports = Student;
