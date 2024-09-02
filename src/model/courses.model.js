const {sequelize, Model, DataTypes} = require('../DB/database');

class Course extends Model {}
Course.init({
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
    modelName: 'Course',
  }
);

module.exports = Course;
