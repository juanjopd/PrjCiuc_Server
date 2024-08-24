const router = require("express").Router();
const Users = require("../model/user.model");

router.get("/users", async (req, res) => {
  const users = await Users.findAll();
  res.status(200).json({
    ok: true,
    status: 200,
    body: users,
  });
});

router.get("/users/:user_id", async (req, res) => {
  const id = req.params.user_id;
  const user = await Users.findOne({
    where: {
      user_id: id,
    },
  });
  res.status(200).json({
    ok: true,
    status: 200,
    body: user,
  });
});

router.post("/users", async (req, res) => {
  await Users.sync();
  const { user_name, email, password, idioma } = req.body;
  await Users.create({
    user_name,
    email,
    password,
    idioma,
  });
  res.status(201).json({
    ok: true,
    status: 201,
    message: "Created User",
  });
});

router.put("/users/:user_id", async (req, res) => {
  const id = req.params.user_id;
  const { user_name, email, password, idioma } = req.body;
  const updateUser = await Users.update(
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
});

router.delete("/users/:user_id", async (req, res) => {
  const id = req.params.user_id;
  const deleteUser = await Users.destroy({
    where: { user_id: id },
  });
  res.status(200).json({
    ok: true,
    status: 204,
    body: deleteUser,
  });
});

module.exports = router;
