
const { AIManager } = require('../utilities')

const aiManager = new AIManager()

const questionsPOST = () => {
    return aiManager.generateQuestionBatch()
}

const personaPOST = async (answerObjs) => {
    const response = await aiManager.generatePersona(JSON.stringify(answerObjs))
    return response
}

const imagePOST = async (answerObjs) => {
    const response = await aiManager.generateImage(JSON.stringify(answerObjs))
    console.log('response being sent: ' + response)
    return response
}

module.exports = {
    questionsPOST,
    personaPOST,
    imagePOST,
}
