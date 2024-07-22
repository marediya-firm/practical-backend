import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { User } from "./model/User.js";
import cors from "cors";
import bcrypt from "bcryptjs";
const app = express();
const port = 8080;

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://freecoding92:HYJ6LyvvXzg4Gdhy@ccluster0.ommvo7q.mongodb.net/practical?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(cors());
app.use(bodyParser.json());

// API to create a user
app.post("/api/register", async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, password } = req.body;
    const response = User.findOne({ mobileNumber }).findOne();
    if (!response?.mobileNumber) {
      const user = new User({
        firstName,
        lastName,
        mobileNumber,
        password,
      });
      await user.save();
      res.status(201).send({ success: true, user });
    } else {
      res
        .status(201)
        .send({ success: false, error: "Phone number already exists" });
    }
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

// API to create a user
app.post("/api/login", async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;
    const response = await User.findOne({ mobileNumber }).findOne();
    console.log("response", response, mobileNumber, password);
    if (!response) {
      return res
        .status(201)
        .send({ success: false, error: "Phone number not exists" });
    }
    const isPasswordValid = await bcrypt.compare(password, response?.password);
    if (!isPasswordValid) {
      return res
        .status(201)
        .send({ success: false, error: "Incorrect password" });
    }
    res.status(201).send({ success: true, message: "successfully login" });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ success: false, error: error.message });
  }
});

// API to get a user
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    res.send({ success: true, user });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

// API to update a user
app.put("/api/users/:id", async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, password, updatedBy } = req.body;
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "User not found" });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.mobileNumber = mobileNumber || user.mobileNumber;
    if (password) user.password = password;
    user.updatedBy = updatedBy || user.updatedBy;
    user.updatedDate = Date.now();

    await user.save();
    res.send({ success: true, user });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

// API to delete a user
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    res.send({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
