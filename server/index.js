const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");
const BuyModel = require("./models/Buy");
const SellModel = require("./models/Sell");
const GraphModel = require("./models/Graph");
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

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {});

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
        balance: user.balance,
        // Add other properties you want to send to the client
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching user profile" });
  }
});

// Projecting all the people in home page
app.get("/allusers", (req, res) => {
  UserModel.find()
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

// Get all buys
app.get("/fetchbuys", (req, res) => {
  BuyModel.find()
    .then((buys) => res.json(buys))
    .catch((err) => console.log(err));
});

app.get("/fetchsells", (req, res) => {
  SellModel.find()
    .then((sells) => res.json(sells))
    .catch((err) => console.log(err));
});

// fetching buys of logged in user for specific Social Coin
app.get("/fetchspecificbuys/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the id of the user whose profile is selected/opened

    // Fetch the logged-in user's information from the token
    const tokenHeader = req.header("Authorization");
    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = tokenHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, SECRET_KEY);
    const loggedInUserId = decoded.userId;

    // Get the username of the logged-in user
    const loggedInUser = await UserModel.findById(loggedInUserId);
    const loggedInUsername = loggedInUser.username;

    // Get the username of the user whose profile is selected/opened
    const selectedUser = await UserModel.findById(id);
    const selectedUsername = selectedUser.username;

    // Fetch buys where usernameofbuyer is the same as the username of the logged-in user
    // and usernameofsc is the same as the username of the selected user
    const specificBuys = await BuyModel.find({
      usernameofbuyer: loggedInUsername,
      usernameofsc: selectedUsername,
    });

    // Sum up all the amountboughtinsc values
    let totalAmountBoughtInSC = 0;
    specificBuys.forEach((buy) => {
      totalAmountBoughtInSC += buy.amountboughtinsc;
    });

    res.status(200).json({ specificBuys, totalAmountBoughtInSC });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching specific buys" });
  }
});

// fetching sells of logged in user for specific Social Coin
// fetching sells of logged in user for specific Social Coin
app.get("/fetchspecificsells/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the id of the user whose profile is selected/opened
    console.log("ID", id);
    // Fetch the logged-in user's information from the token
    const tokenHeader = req.header("Authorization");
    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = tokenHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, SECRET_KEY);
    const loggedInUserId = decoded.userId;
    console.log("loggedinUserID", loggedInUserId);

    // Get the username of the logged-in user
    const loggedInUser = await UserModel.findById(loggedInUserId);
    const loggedInUsername = loggedInUser.username;

    console.log("loggedInUsername", loggedInUsername);

    // Get the username of the user whose profile is selected/opened
    const selectedUser = await UserModel.findById(id);
    const selectedUsername = selectedUser.username;

    console.log("selectedUsername", selectedUsername);

    // Fetch sells where usernameofsc is the same as the username of the selected user
    // and usernameofseller is the same as the username of the logged-in user
    const specificSells = await SellModel.find({
      usernameofsc: selectedUsername,
      usernameofseller: loggedInUsername,
    });

    let totalAmountSoldInSC = 0;
    specificSells.forEach((sell) => {
      totalAmountSoldInSC += sell.amountsoldinsc;
    });

    res.status(200).json({
      specificSells,
      totalAmountSoldInSC,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching specific sells" });
  }
});

// Getting info of only one specific person
app.get("/:id", (req, res) => {
  UserModel.findById(req.params.id)
    .then((result) => {
      res.status(200).json({
        user: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
});

// Update CCM endpoint
// Update CFI endpoint
// Update Balance endpoint
app.post("/buy", async (req, res) => {
  try {
    const { fcoinamount, scyouget, cuserId, userId, cusername, username } =
      req.body;

    // Update balance of the currently logged-in user
    await UserModel.findByIdAndUpdate(
      cuserId,
      { $inc: { balance: -fcoinamount } },
      { new: true }
    );

    // Update cfi and ccm of the user whose profile is currently open
    await UserModel.findByIdAndUpdate(
      userId,
      { $inc: { cfi: fcoinamount, ccm: scyouget } },
      { new: true }
    );

    const user = await UserModel.findById(userId);
    // Calculate the price based on user's ccm
    const price = ((user.ccm + 1) * (user.ccm + 1) * 0.003 - user.ccm * user.ccm * 0.003).toFixed(2);
    console.log("Printing Price", price);
    const timestamp = new Date();
    await GraphModel.create({
      usernameofsc: username,
      price,
      timestamp,
    });

    try {
      const newBuy = new BuyModel({
        amountboughtinfcoins: fcoinamount,
        amountboughtinsc: scyouget,
        usernameofbuyer: cusername,
        usernameofsc: username,
      });

      await newBuy.save();
    } catch (e) {
      console.log(e);
    }
    res.status(200).json({ message: "Coins purchased successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error purchasing coins" });
  }
});

app.post("/sell", async (req, res) => {
  try {
    const { scoinamount, fcyouget, cuserId, userId, cusername, username } =
      req.body;
    // Update the user's data in the database
    await UserModel.findByIdAndUpdate(
      userId,
      { $inc: { cfi: -fcyouget, ccm: -scoinamount } },
      { new: true }
    );

    // Update the current logged-in user's balance in the database
    await UserModel.findByIdAndUpdate(
      cuserId,
      { $inc: { balance: fcyouget } },
      { new: true }
    );

    // Save price and timestamp information to the Graph collection
    const user = await UserModel.findById(userId);
    // Calculate the price based on user's ccm
    const price = ((user.ccm + 1) * (user.ccm + 1) * 0.003 - user.ccm * user.ccm * 0.003).toFixed(2);
    console.log("Printing Price", price);
    const timestamp = new Date();
    await GraphModel.create({
      usernameofsc: username,
      price,
      timestamp,
    });

    try {
      const newSell = new SellModel({
        amountreceivedinfcoins: fcyouget,
        amountsoldinsc: scoinamount,
        usernameofsc: username,
        usernameofseller: cusername,
      });
      await newSell.save();
    } catch (e) {
      console.log(e);
    }

    res.status(200).json({ message: "Coins sold successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error selling coins" });
  }
});



// Add a new endpoint to fetch graph data based on usernameofsc and convert timestamp to unix
app.get("/specificgraphdatum/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const graphData = await GraphModel.find({ usernameofsc: username })
      .sort({ timestamp: 1 }) // Sort by timestamp in ascending order
      .select("price timestamp -_id"); // Select only price and timestamp fields, exclude _id field

    // Convert timestamp to Unix format
    const formattedGraphData = graphData.map((data) => {
      return {
        price: data.price,
        timestamp: new Date(data.timestamp).getTime(), // Convert timestamp to Unix format
      };
    });

    res.status(200).json(formattedGraphData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching graph data" });
  }
});

// Fetch graph data
app.get("/all/allgraphdata", async (req, res)=>{
  GraphModel.find()
    .then((graphs) => res.json(graphs))
    .catch((err) => console.log(err));
})

app.listen(3001, () => {
  console.log("server is running on port");
});
