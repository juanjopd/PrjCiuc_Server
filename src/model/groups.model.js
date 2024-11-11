const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../DB/database");

class Groups extends Model {}
Groups.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    tipo: { type: DataTypes.STRING, allowNull: false },
    nivel: { type: DataTypes.STRING, allowNull: false },
    idioma: { type: DataTypes.STRING, allowNull: false },
    profesor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Professors",
        key: "id",
      },
    },
  },
  { sequelize, modelName: "groups", tableName: "Groups", timestamps: true }
);

module.exports = Groups;
