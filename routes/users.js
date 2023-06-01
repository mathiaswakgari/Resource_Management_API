const express = require("express");
const route = express.Router();
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

route.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send(user);
});
route.post("/me", auth, async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.body._id },
    { password: req.body.password }
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();
  const token = jwt.sign(
    { _id: user._id, fullName: user.fullName, email: user.email },
    "resource"
  );
  res
    .header("x-token", token)
    .send(_.pick(user, ["_id", "fullName", "email"]))
    .send(token);
});
route.get("/", auth, admin, async (req, res) => {
  const users = await User.find({ isAdmin: false });
  res.send(users);
});

route.delete("/:id", async (req, res) => {
  const user = await User.deleteOne({ _id: req.params.id });
});

route.post("/", async (req, res) => {
  const { error } = validate(req.body);
  try {
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User Already Exists.");
    user = new User({
      fullName: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save();

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        isAdmin: user.isAdmin,
      },
      "resource"
    );

    res
      .header("x-token", token)
      .send(_.pick(user, ["_id", "fullName", "email"]));
  } catch (e) {
    console.log(e);
  }
});

module.exports = route;
