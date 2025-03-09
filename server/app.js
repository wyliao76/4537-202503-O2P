const express = require("express");
require('dotenv').config();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const DatabaseManager = require('./database');

const app = express();
app.use(express.json()); 
app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend")));

const dbManager = new DatabaseManager();
dbManager.dbConnect();

app.get("/api/users", async (req, res) => {
    const users = await dbManager.User.find();
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
