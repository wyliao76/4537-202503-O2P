const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI
});

class aiManager {

    async sendTextRequest() {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: "Write a haiku about recursion in programming.",
                },
            ]
        });
        
        console.log(completion.choices[0].message.content);
    }
}

ai = new aiManager();
ai.sendTextRequest();


