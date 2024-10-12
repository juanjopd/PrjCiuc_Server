const User = require('../model/user.model');
const { generateToken, verifyToken } = require('../middlewares/jwtUtils');
const { hashPassword, comparePassword } = require('./utils/passwordUtils');
const { sendEmail } = require('./utils/emailUtils');

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
      
     /*  if (!user.isVerified) {
        return res.status(403).json({ message: 'Cuenta no verificada' });
      } */
      
      const token = generateToken({ userId: user._id });
      console.log(token);
      res.cookie('token', token, { httpOnly: true });
      res.json({ message: 'Login exitoso', user: { id: user._id, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
  },

  async logout(req, res) {
    res.clearCookie('token');
    res.json({ message: 'Logout exitoso' });
  },

  async recoverPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
      const resetToken = generateToken({ userId: user._id }, '1h');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
      await user.save();
      
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      await sendEmail({
        to: user.email,
        subject: 'Recuperación de contraseña',
        text: `Para resetear tu contraseña, haz clic en este enlace: ${resetUrl}`
      });
      
      res.json({ message: 'Se ha enviado un email con instrucciones para recuperar la contraseña' });
    } catch (error) {
      res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      const decoded = verifyToken(token);
      
      const user = await User.findOne({
        _id: decoded.userId,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
      
      if (!user) {
        return res.status(400).json({ message: 'Token inválido o expirado' });
      }
      
      user.password = await hashPassword(newPassword);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al resetear la contraseña', error: error.message });
    }
  },

  async verifyAccount(req, res) {
    try {
      const { token } = req.params;
      const decoded = verifyToken(token);
      
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
      if (user.isVerified) {
        return res.status(400).json({ message: 'La cuenta ya está verificada' });
      }
      
      user.isVerified = true;
      await user.save();
      
      res.json({ message: 'Cuenta verificada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al verificar la cuenta', error: error.message });
    }
  }
};

module.exports = authController;