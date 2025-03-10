const { OpenAI } = require('openai')
const axios = require('axios')

const openai = new OpenAI({
    apiKey: process.env.OPENAI,
})

class AIManager {
    async generateImage(userAnswers) {
        let imagePrompt

        const completion1 = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                {
                    role: 'user',
                    content: `Based on the following answers to personality questions,
                    generate a prompt that will generate an image of a superhero that fits this persona: ${userAnswers}`,
                },
            ],
        })

        imagePrompt = completion1.choices[0].message.content

        const completion2 = await axios({
            method: 'POST',
            url: 'https://api.openai.com/v1/images/generations',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI}`,
            },
            data: {
                prompt: `${imagePrompt}`,
                n: 1,
                size: '256x256',
            },
        })

        const imageUrl = completion2.data.data[0].url
        return imageUrl
    }

    async generatePersona(userAnswers) {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                {
                    role: 'user',
                    content: `Based on the following answers to personality questions,
                    generate a short persona on a superhero: ${userAnswers}`,
                },
            ],
        })

        console.log('In persona func: ' + completion.choices[0].message.content)

        return completion.choices[0].message.content
    }

    async generateQuestionBatch() {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                {
                    role: 'user',
                    content: `Generate 3 personality questions with 4 multiple-choice answers each.
                    
    Format **strictly** like this:
    
    1: <your question>
    A) <answer>
    B) <answer>
    C) <answer>
    D) <answer>
    
    2: <your question>
    A) <answer>
    B) <answer>
    C) <answer>
    D) <answer>
    
    3: <your question>
    A) <answer>
    B) <answer>
    C) <answer>
    D) <answer>
    
    **Do NOT add extra text, explanations, or greetings.**`,
                },
            ],
        })

        console.log('In func: ' + completion.choices[0].message.content)

        return completion.choices[0].message.content
    }
}

module.exports = AIManager


