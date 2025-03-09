const mongoose = require("mongoose");
require('dotenv').config();

class DatabaseManager {
    constructor() {
        this.mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;

        this.User = mongoose.model("User", new mongoose.Schema({
            email: { type: String, required: true },
            password: { type: String, required: true },
            role: { type: String, default: "user" },
            api_tokens: { type: Number, default: 0 }
        })); 
    }

    dbConnect() {
        mongoose.connect(this.mongoURI)
        .then(() => {
            console.log("MongoDB connected successfully!");
        }).catch(err => {
            console.error("MongoDB connection error:", err);
        });
    }
}

module.exports = DatabaseManager;