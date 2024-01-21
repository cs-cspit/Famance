const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const SECRET_KEY = "secretkey";

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));


mongoose.connect("mongodb://127.0.0.1:27017/famance");

app.post("/signup", async (req, res) => {
  try {
    // Requesting the information that's in the body, these are the inputs we're taking
    const { username, firstname, lastname, email, bio, password } = req.body;
    // Hashing the password using bcrypt, 10 is the complexity or difficulty
    const hashedPassword = await bcrypt.hash(password, 10);
    // UserModel is what we've set in User.js and we're creating a new entity newUser
    const newUser = new UserModel({
      username,
      firstname,
      lastname,
      email,
      bio,
      password: hashedPassword,
    });
    // Saving/storing the new entity in mongodb
    await newUser.save();
    // Successful status
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // Error status
    console.log(error);
    res.status(500).json({ error: "Error signing up" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(401).json({error: "Invalid Credentials"})
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1hr",
    });

    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        image: user.imageURL
      },
    });
    console.log(res.json)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error logging you in" });
  }
});

app.listen(3001, () => {
  console.log("server is running on port");
});
