const cors = require("cors");
const { sequelize } = require("./src/DB/database");
const app = require("./src/app/app");

const port = process.env.PORT || 3001;

// ver configuracion del cors en app.js
app.use(
  cors({
    origin: "http://localhost:5173", // cuando lo subas a produccion pon la URL del front
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// Sincronizar la base de datos
app.listen(port, async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log(`Server running at http://localhost:${port}`);
  } catch (err) {
    console.error("Error during database sync:", err);
  }
});
