const User = require("../model/user.model");

const isTeacher = async (req, res, next) => {
  try {
    const { email } = req.cookies;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Se requiere el email del usuario." });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (user.role === "teacher" || user.role === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta." });
    }
  } catch (error) {
    console.error("Error en middleware isTeacher:", error);
    return res
      .status(500)
      .json({ message: "Error al verificar permisos.", error: error.message });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const { email } = req.cookies; // Confirm if email is received from cookies
    console.log("Email recibido del cookie:", email);

    if (!email) {
      console.log("No se recibió el email.");
      return res
        .status(400)
        .json({ message: "Se requiere el email del usuario." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("Usuario no encontrado.");
      return res
        .status(403)
        .json({ message: "No tienes permisos para acceder." });
    }

    if (!user.isAdmin) {
      console.log("El usuario no es administrador.");
      return res
        .status(403)
        .json({ message: "No tienes permisos para acceder." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error en el middleware isAdmin:", error);
    return res.status(500).json({ message: "Error al verificar permisos." });
  }
};

module.exports = { isTeacher, isAdmin };
