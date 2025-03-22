
const { AIManager } = require('../utilities')
const quizModel = require('../models/quizes')
const usersModel = require('../models/users')
const tokensModel = require('../models/tokens')

const aiManager = new AIManager()

const quizzesGET = async () => {
    try {
        const quizzes = await quizModel.find({});
        if(!quizzes) {
            console.log("No quizzes");
        }
        
        return quizzes;
    } catch(error) {
        console.log("Error getting quizzes:", error)
    }
}

const tokensGET = async (email) => {
    try {
        const user = await tokensModel.findOne({ email: email });
        if (!user) {
            console.log(`User not found: ${email}`);
            return;
        }

        console.log(`user tokens: ${email}, ${user.tokens}`)

        return user.tokens;

    } catch (error) {
        console.error("Error getting token count:", error);
    }
}

const decrementApiTokens = async (email) => {

    try {
        const user = await tokensModel.findOne({ email: email });
        if (!user) {
            console.log(`User not found: ${email}`);
            return;
        }

        if(user.tokens > 0) {
            const res = await tokensModel.updateOne({ email: email }, { $inc: { tokens: -1 } });
            console.log(`updated tokens of: ${email}`);
        }

    } catch (error) {
        console.error("Error decrementing API tokens:", error);
    }
} 

const questionsGET = () => {
    return aiManager.generateQuestionBatch()
}

const personaPOST = async (body) => {
    const quizType = body.quizType;
    const answers = JSON.stringify(body.answers);

    const response = await aiManager.generate(quizType, answers);

    return response
}

module.exports = {
    questionsGET,
    personaPOST,
    quizzesGET,
    decrementApiTokens,
    tokensGET
}
