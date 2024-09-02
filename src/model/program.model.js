const {sequelize, Model, DataTypes} = require('../DB/database');

class Programs extends Model {}
Programs.init({
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
    modelName: 'Programs',
  }
);

module.exports = Programs;
