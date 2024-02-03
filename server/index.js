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

// Sending signup data to mongodb hashing pass and taking other basic info
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

// Matching login info from the database and checking either username or email using $or for mongo
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

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      
    });

    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        image: user.imageURL,
      },
    });
    console.log(res.json);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error logging you in" });
  }
});

// Sending user info to project/display at the my profile user page
app.get("/myprofile", async (req, res) => {
  try {
    const tokenHeader = req.header("Authorization");

    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = tokenHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        imageURL: user.imageURL,
        balance: user.balance
        // Add other properties you want to send to the client
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching user profile" });
  }
});

// Projecting all the people in home page
app.get("/allusers", (req, res)=>{
  UserModel.find()
  .then(users=>res.json(users))
  .catch(err=>res.json(err))
})

// Getting info of only one specific person
app.get("/:id", (req, res)=>{
  console.log(req.params.id)
  UserModel.findById(req.params.id)
  .then(result => {
    res.status(200).json({
      user:result,
    })
  })
  .catch(err=>{
    console.log(err)
    res.status(500)
  })
})

// Update ccm endpoint
// Update ccm endpoint
app.put("/update-ccm/:id", async (req, res) => {
  try {
    const tokenHeader = req.header("Authorization");

    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = tokenHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;

    // Check if the logged-in user matches the user whose card was clicked
    if (userId === req.params.id) {
      return res.status(403).json({ error: "Forbidden: Cannot update own ccm" });
    }

    const userToUpdate = await UserModel.findById(userId);

    if (!userToUpdate) {
      return res.status(404).json({ error: "User not found" });
    }

    // Subtract the fcoinamount from the balance
    userToUpdate.balance -= req.body.fcoinamount;

    // Update the ccm value
    userToUpdate.ccm += req.body.ccm;
    
    await userToUpdate.save();

    res.status(200).json({ message: "ccm and balance updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating ccm and balance" });
  }
});


app.listen(3001, () => {
  console.log("server is running on port");
});
