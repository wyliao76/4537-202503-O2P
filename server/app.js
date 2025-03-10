const express = require("express");
require('dotenv').config();
const cors = require("cors");
const path = require("path");

const DatabaseManager = require('./database');
const AIManager = require('./ai');

const app = express();
app.use(express.json()); 
app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend")));

const dbManager = new DatabaseManager();
dbManager.dbConnect();

const aiManager = new AIManager();

app.get("/api/users", async (req, res) => {
    const users = await dbManager.User.find();
    res.json(users);
});

app.post("/api/questions", async(req, res) => {
    const response = await aiManager.generateQuestionBatch();
    res.json( response );
});

app.post("/api/persona", async(req, res) => {
    const answerObjs = req.body;
    const response = await aiManager.generatePersona(JSON.stringify(answerObjs));
    res.json( response );
});

app.post("/api/image", async(req, res) => {
    const answerObjs = req.body;
    const response = await aiManager.generateImage(JSON.stringify(answerObjs));
    console.log("response being sent: " + response);
    res.json( response );
});

app.post("/users", async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send("User created!");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/questions", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/questions.html"));
});


app.listen(process.env.port || 3000, () => console.log("Server purring on port 3000"));
