const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI
});

class AIManager {

    async generateSingleQuestion() {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: "Give me a general question that reaveals something about my personallity. Then give 4 multiple choice answers. Do not add sure to the start of the response only the question and the answers",
                },
            ]
        });

        console.log("In func: " + completion.choices[0].message.content)
        
        return completion.choices[0].message.content;
    }
}

module.exports = AIManager;


