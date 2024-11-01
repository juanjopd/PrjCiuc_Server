const User = require("../model/user.model");
const { generateToken, verifyToken } = require("../middlewares/jwtUtils");
const { hashPassword, comparePassword } = require("./utils/passwordUtils");
const { sendEmail } = require("./utils/emailUtils");

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validación de entrada
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email y contraseña son requeridos" });
      }

      console.log("Attempting to login with email:", email);

      const user = await User.findOne({
        where: { email: email.toLowerCase() },
      });

      console.log("User  found:", user ? user.email : "No user found");

      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      if (!(await comparePassword(password, user.password))) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const token = generateToken({
        userId: user.user_id,
        email: user.email,
        role: user.role,
      });
      res.json({
        message: "Login exitoso",
        user: {
          id: user.user_id,
          email: user.email,
          name: user.name,
          role: user.role,
          token: token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        message: "Error en el servidor",
        error: error.message || "Error desconocido",
      });
    }
  },

  async logout(req, res) {
    res.clearCookie("token");
    res.json({ message: "Logout exitoso" });
  },

  async recoverPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const resetToken = generateToken({ userId: user._id }, "1h");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
      await user.save();

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      await sendEmail({
        to: user.email,
        subject: "Recuperación de contraseña",
        text: `Para resetear tu contraseña, haz clic en este enlace: ${resetUrl}`,
      });

      res.json({
        message:
          "Se ha enviado un email con instrucciones para recuperar la contraseña",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al procesar la solicitud",
        error: error.message,
      });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      const decoded = verifyToken(token);

      const user = await User.findOne({
        _id: decoded.userId,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ message: "Token inválido o expirado" });
      }

      user.password = await hashPassword(newPassword);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
      res.status(500).json({
        message: "Error al resetear la contraseña",
        error: error.message,
      });
    }
  },

  async verifyAccount(req, res) {
    try {
      const { token } = req.params;
      const decoded = verifyToken(token);

      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (user.isVerified) {
        return res
          .status(400)
          .json({ message: "La cuenta ya está verificada" });
      }

      user.isVerified = true;
      await user.save();

      res.json({ message: "Cuenta verificada exitosamente" });
    } catch (error) {
      res.status(500).json({
        message: "Error al verificar la cuenta",
        error: error.message,
      });
    }
  },
};

module.exports = authController;
