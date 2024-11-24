const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize("CiucBD", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

module.exports = { sequelize, Model, DataTypes };

//#region Modelos y relaciones
const Students = require("../model/studens.model");
const Courses = require("../model/courses.model");
const Payments = require("../model/payments.model");
const Programs = require("../model/program.model");
const Professors = require("../model/professors.model"); // Modelo nuevo
const Groups = require("../model/groups.model"); // Modelo nuevo
const Attendances = require("../model/attendances.model"); // Modelo nuevo
const Grades = require("../model/grade.model");
const Facultad = require("../model/facultad.model");

// Definir relaciones

// Relación 1:N entre Courses y Students
Students.belongsTo(Courses, { foreignKey: "course_id" });
Courses.hasMany(Students, { foreignKey: "course_id" });

// Relación 1:1 entre Students y Payments
Students.hasOne(Payments, { foreignKey: "student_id" });
Payments.belongsTo(Students, { foreignKey: "student_id" });

// Relación 1:N entre Payments y Courses
Payments.belongsTo(Courses, { foreignKey: "course_id" });
Courses.hasMany(Payments, { foreignKey: "course_id" });

// Relación 1:N entre Students y Programs
Students.belongsTo(Programs, { foreignKey: "program_id" });
Programs.hasMany(Students, { foreignKey: "program_id" });

// Relación 1:N entre Courses y Professors
Courses.belongsTo(Professors, { foreignKey: "professor_id" });
Professors.hasMany(Courses, { foreignKey: "professor_id" });

// Relación 1:N entre Groups y Courses
Groups.hasMany(Courses, { foreignKey: "group_id" });
Courses.belongsTo(Groups, { foreignKey: "group_id" });

// Relación 1:N entre Professors y Groups
Groups.belongsTo(Professors, { foreignKey: "professor_id" });
Professors.hasMany(Groups, { foreignKey: "professor_id" });

// Relación 1:N entre Students y Attendances
Students.hasMany(Attendances, { foreignKey: "student_id" });
Attendances.belongsTo(Students, { foreignKey: "student_id" });

// Relación 1:N entre Courses y Attendances
Courses.hasMany(Attendances, { foreignKey: "course_id" });
Attendances.belongsTo(Courses, { foreignKey: "course_id" });

// Relación entre Students y Grades (1:N)
Students.hasMany(Grades, { foreignKey: "student_id" });
Grades.belongsTo(Students, { foreignKey: "student_id" });

// Relación 1:N entre Students y Groups
Students.belongsTo(Groups, { foreignKey: "group_id" });
Groups.hasMany(Students, { foreignKey: "group_id" });

// Relacion N:1 entre programa y facultad
Facultad.hasMany(Programs, { foreignKey: "facultad_id" });
Programs.belongsTo(Facultad, { foreignKey: "facultad_id" });

Students.hasMany(Courses, {
  foreignKey: "student_id", // Nombre de la columna en Courses
  sourceKey: "student_code", // Llave primaria en Students
  as: "courses", // Alias para la relación
});

Courses.belongsTo(Students, {
  foreignKey: "student_id", // Nombre de la columna en Courses
  targetKey: "student_code", // Llave primaria en Students
  as: "student", // Alias para la relación
});
