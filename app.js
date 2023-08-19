require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/Auth");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!(email && password && firstName && lastName)) {
    return res.status(400).send("All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(401).send("Already Registered");
  }

  const encpassowrd = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: encpassowrd,
  });

  //if user wants to login directly once after singup do jwt sign here

  res.status("201").send({ status: "Successfuly Created" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).send({ status: "User not Registered" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = await jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET_KEY
    );

    user.password = undefined;

    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .json({ user, success: true });
  } else {
    return res.status(401).send({ status: "Incorrect Password" });
  }
});

app.get("/secureroute", auth, (req, res) => {
  res.status(200).send({ user: req.body.user });
});

module.exports = app;
