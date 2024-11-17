const { sequelize, Model, DataTypes } = require("../DB/database");
const Facultad = require("./facultad.model");

class Programs extends Model {}
Programs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    facultad_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Facultad,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Programs",
  }
);

module.exports = Programs;
