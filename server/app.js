const express = require("express");
require('dotenv').config();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json()); 
app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend")));

const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;

mongoose.connect(mongoURI)
.then(() => {
    console.log("MongoDB connected successfully!");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

const User = mongoose.model("User", new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    api_tokens: { type: Number, default: 0 }
}));
    

app.get("/api/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.post("/users", async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send("User created!");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


app.listen(process.env.port || 3000, () => console.log("Server running on port 3000"));
