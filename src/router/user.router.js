const express = require("express");
const router = express.Router();
const User = require("../model/user.model");

// Define las rutas
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      ok: true,
      status: 200,
      body: users,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      error: error.message,
    });
  }
});

router.get("/users/:user_id", async (req, res) => {
  try {
    const id = req.params.user_id;
    const user = await User.findOne({
      where: {
        user_id: id,
      },
    });
    res.status(200).json({
      ok: true,
      status: 200,
      body: user,
    });
  } catch (error) {
    res.status(404).json({
      ok: false,
      status: 404,
      error: "User not found",
    });
  }
});

router.post("/users", async (req, res) => {
  try {
    const { user_name, email, password, idioma } = req.body;
    const newUser = await User.create({
      user_name,
      email,
      password,
      idioma,
    });
    res.status(201).json({
      ok: true,
      status: 201,
      body: newUser,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      status: 400,
      error: "Invalid request data",
    });
  }
});

router.put("/users/:user_id", async (req, res) => {
  try {
    const id = req.params.user_id;
    const { user_name, email, password, idioma } = req.body;
    const updateUser = await User.update(
      { user_name, email, password, idioma },
      {
        where: {
          user_id: id,
        },
      }
    );
    res.status(200).json({
      ok: true,
      status: 200,
      body: updateUser,
    });
  } catch (error) {
    res.status(404).json({
      ok: false,
      status: 404,
      error: "User not found",
    });
  }
});

router.delete("/users/:user_id", async (req, res) => {
  try {
    const id = req.params.user_id;
    const deleteUser = await User.destroy({
      where: { user_id: id },
    });
    res.status(204).json({
      ok: true,
      status: 204,
      body: deleteUser,
    });
  } catch (error) {
    res.status(404).json({
      ok: false,
      status: 404,
      error: "User not found",
    });
  }
});

module.exports = router;
