const { sequelize, Model, DataTypes } = require("../DB/database");

class Facultad extends Model {}

Facultad.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Facultad",
    tableName: "Facultades",
    timestamps: true,
  }
);

module.exports = Facultad;
