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

//relaciones en la base de datos......... (creo que era aca no recuerdo si algo me avisa xD)
