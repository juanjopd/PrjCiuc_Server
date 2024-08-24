const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize("CiucBD", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

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
    modelName: "User",
  }
);

module.exports = User;

/* async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("All Good!!");
  } catch (err) {
    console.error("All Bad!!", err);
  }
}

testConnection(); */
