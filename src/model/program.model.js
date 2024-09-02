const {sequelize, Model, DataTypes} = require('../DB/database');

class Program extends Model {}
Program.init({
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
    modelName: 'Program',
  }
);

module.exports = Program;
