
const { AIManager } = require('../utilities')

const aiManager = new AIManager()

const questionsGET = () => {
    return aiManager.generateQuestionBatch()
}

const personaPOST = async (body) => {
    const response = await aiManager.generate(JSON.stringify(body))
    return response
}

module.exports = {
    questionsGET,
    personaPOST,
}
