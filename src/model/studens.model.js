const { sequelize, Model, DataTypes } = require("../DB/database");

class Student extends Model {}

Student.init(
  {
    student_code: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    student_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    student_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    semestre: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    payment: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gradeHistory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Groups", // Nombre del modelo al que hace referencia
        key: "id", // Campo de referencia en el modelo `Groups`
      },
    },
  },
  {
    sequelize,
    modelName: "Student",
  }
);

module.exports = Student;
