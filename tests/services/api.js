const { redis, CustomError } = require('../../src/utilities/index')
const usersModel = require('../../src/models/users')
const { apiService } = require('../../src/services')

const users = [
    { email: 'admin@gmail.com', password: 'admin', role: 'admin' },
    { email: 'test@gmail.com', password: '123', role: 'normal' },
]

describe('api', () => {
    describe('personaPOST', () => {
        beforeEach(async () => {
            await usersModel.insertMany(users)
        })

        it('pass', async () => {
            const req = {
                body: '\n                    {\n                        "questions": [\n                            {\n                                "question": "How do you usually handle stress?",\n                                "options": {\n                                    "a": "Exercise",\n                                    "b": "Meditation",\n                                    "c": "Talking to a friend",\n                                    "d": "Taking a nap"\n                                }\n                            },\n                            {\n                                "question": "What is your ideal way to spend a weekend?",\n                                "options": {\n                                    "a": "Exploring nature",\n                                    "b": "Attending social events",\n                                    "c": "Netflix and chill",\n                                    "d": "Working on personal projects"\n                                }\n                            },\n                            {\n                                "question": "What type of books do you enjoy reading the most?",\n                                "options": {\n                                    "a": "Fiction",\n                                    "b": "Self-help",\n                                    "c": "Fantasy",\n                                    "d": "Biography"\n                                }\n                            }\n                        ]\n                    }',
            }
            const results = await apiService.personaPOST(req.body)
            console.log(results)

            // expect(results).toHaveLength(2)
            // results.forEach((result, index) => {
            //     expect(result.email).toBe(users[index].email)
            //     expect(result.role).toBe(users[index].role)
            //     expect(result.lastLogin).toBeNull()
            //     expect(result.enable).toBe(true)
            //     expect(result.api_tokens).toBe(20)
            // })
        })
    })
})
