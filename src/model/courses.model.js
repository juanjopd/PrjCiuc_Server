const { sequelize, Model, DataTypes } = require("../DB/database");

class Courses extends Model {}
Courses.init(
  {
    idCourse: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Students", // Nombre de la tabla de estudiantes
        key: "id",
      },
    },
    grade: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      // Campo adicional para estado (aprobado/reprobado)
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pendiente",
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Groups", // Nombre de la tabla de grupos
        key: "id", // Clave primaria del modelo Groups
      },
    },
  },
  {
    sequelize,
    modelName: "Courses",
    tableName: "Courses",
    timestamps: true,
  }
);

module.exports = Courses;
