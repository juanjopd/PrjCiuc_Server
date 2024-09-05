const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize("CiucBD", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = { sequelize, Model, DataTypes };
const Students = require('../model/studens.model');
const Courses = require('../model/courses.model');
const Payments = require('../model/payments.model');
const Programs = require('../model/program.model');


//definir relaciones
Students.belongsTo(Courses, {foreignKey: 'id'}); 
Courses.hasMany(Students, {foreignKey: 'course_id'});

//1:1 studens to payments
Students.belongsTo(Payments, {foreignKey: 'id'});
Payments.hasMany(Students, {foreignKey: 'payment_id'});


Payments.belongsTo(Courses, {foreignKey: 'id'});
Courses.hasMany(Payments, {foreignKey: 'course_id'});

Students.belongsTo(Programs, {foreignKey: 'id'}); 
Programs.hasMany(Students, {foreignKey: 'program_id'});

