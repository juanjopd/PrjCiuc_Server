const { sequelize, Model, DataTypes } = require('../DB/database');

class User extends Model {}

User.init(
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idioma: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, 
    modelName: 'User',
  }
);

module.exports = User;
