const {sequelize, Model, DataTypes} = require('../DB/database');

class   Courses extends Model {}
Courses.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Courses',
  }
);

module.exports = Courses;
