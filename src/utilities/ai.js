const { OpenAI } = require('openai')
const axios = require('axios')

class AIManager {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI,
        })
    }

    async generate(quizType, userAnswers) {
        const [personaObject, imageUrl] = await Promise.all([
            this.generatePersona(quizType, userAnswers),
            this.generateImage(quizType, userAnswers),
        ])

        return {
            persona: personaObject,
            imageUrl: imageUrl,
        }
    }

    async generateImage(quizType, userAnswers) {
        const completion1 = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                {
                    role: 'user',
                    content: `Based on the following answers to personality questions,
                    generate a prompt that will generate an image of a ${quizType} that fits this persona: ${userAnswers}`,
                },
            ],
        })

        const imagePrompt = completion1.choices[0].message.content

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

    async generatePersona(quizType, userAnswers) {
        const completion = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                {
                    role: 'user',
                    content: `Based on the following answers to personality questions, generate a short persona on a ${quizType} in JSON format with the following fields: 
                    Name, Powers, Backstory, ArchNemesis. Here are the answers: ${userAnswers}
                    
                    Please structure the response as follows:
                    {
                      "Name": "Superhero Name",
                      "Powers": "List of superhero powers",
                      "Backstory": "Short backstory of the superhero",
                      "ArchNemesis": "Name of the superhero's arch nemesis"
                    }`,
                },
            ],
            response_format: { type: 'json_object' },
        })

        const persona = completion.choices[0].message.content
        const personaObject = JSON.parse(persona)

        return personaObject
    }

    async generateQuestionBatch() {
        const completion = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                {
                    role: 'user',
                    content: `Generate 3 personality questions with 4 multiple-choice answers each. Respond in strict JSON format as follows:
                    [
                        {
                            "question": "What is your preferred way to relax?",
                            "options": {
                                "a": "Reading a book",
                                "b": "Listening to music",
                                "c": "Going for a walk",
                                "d": "Watching a movie"
                            }
                        }
                    ]
                    
                    Only return the JSON array with three unique questions, no additional text.`,
                },
            ],
            response_format: { type: 'json_object' },
        })

        return completion.choices[0].message.content
    }
}

module.exports = { AIManager }
