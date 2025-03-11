
class QuestionManager {
    constructor() {
        this.questionBatch = [] // array to store all questions as object
        this.numOfQuestions = 3 // number of questions to generate. ATM prompt would have to be changed too.
        this.answers = [] // array to store key value pairs of questions and answers
    }

    // make a request to server to propmt AI for questions
    getBatchOfQuestions() {
        fetch('/api/questions', {
            method: 'POST',
        },
        )
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                data = JSON.stringify(data)
                this.separateQuestions(data) // parse questions from API response
                this.displayAllQuestions() // display all questions on DOM
                this.populateAnswerArray()
                console.log(this.answers)
            })
            .catch((error) => {
                console.log('error', error)
            })
    }

    // Seperate delimited questions from API response
    separateQuestions(response) {
        const cleanedResponse = response.replace(/\\"/g, '').replace(/\\n/g, ' ').trim()

        for (let i = 0; i < this.numOfQuestions; i++) {
            let startIndex = cleanedResponse.indexOf(`${i + 1}:`)
            if (startIndex !== -1) {
                startIndex += 1
            }

            let endIndex = cleanedResponse.indexOf(`${i + 2}:`)
            if (endIndex === -1) {
                endIndex = cleanedResponse.length - 1
            }

            // add each question to questionBatch array as question object
            const questionString = cleanedResponse.substring(startIndex, endIndex).trim()
            this.questionBatch.push(this.parseResponse(questionString))
        }
    }

    // parse individual fields of a question and return question object
    parseResponse(response) {
        const cleanedResponse = response.replace(/\\"/g, '').replace(/\\n/g, ' ').trim()

        const question = cleanedResponse.substring(1, cleanedResponse.indexOf('A)')).trim()

        const answer1 = cleanedResponse.substring(cleanedResponse.indexOf('A)'), cleanedResponse.indexOf('B)')).trim()
        const answer2 = cleanedResponse.substring(cleanedResponse.indexOf('B)'), cleanedResponse.indexOf('C)')).trim()
        const answer3 = cleanedResponse.substring(cleanedResponse.indexOf('C)'), cleanedResponse.indexOf('D)')).trim()
        const answer4 = cleanedResponse.substring(cleanedResponse.indexOf('D)'), cleanedResponse.length).trim()

        const questionObj = {
            question: question,
            A: answer1,
            B: answer2,
            C: answer3,
            D: answer4,
        }

        return questionObj
    }

    // display formatted questions on HTML
    displayAllQuestions() {
        // clear space where the questions go
        const questionBatchArea = document.getElementById('question-batch')

        // for each question, create a p tag for question, create a list
        // and append list item for each possible answer
        for (let i = 0; i < this.questionBatch.length; i++) {
            const p = document.createElement('p')
            p.textContent = this.questionBatch[i].question
            const ul = document.createElement('ul')
            questionBatchArea.append(p)
            questionBatchArea.append(ul)
            for (let j = 0; j < 4; j++) {
                const li = this.createAnswerLi(this.questionBatch[i], i, j)
                ul.appendChild(li)
            }
        }
    }

    // create option to answer as list item
    createAnswerLi(question, i, j) {
        const li = document.createElement('li')

        const radio = document.createElement('input')
        radio.type = 'radio'
        radio.name = `question-${i}`
        radio.value = String.fromCharCode(65 + j)

        // on change set answer to chosen anwser
        radio.addEventListener('change', () => {
            this.answers[i].answer = question[String.fromCharCode(65 + j)]
        })

        // add lable to option
        const label = document.createElement('label')
        label.textContent = question[String.fromCharCode(65 + j)]

        li.appendChild(radio)
        li.appendChild(label)

        return li
    }

    // set default answer to each question
    populateAnswerArray() {
        for (let i = 0; i < this.numOfQuestions; i++) {
            const AnswerObj = {
                question: this.questionBatch[i].question,
                answer: '',
            }

            this.answers.push(AnswerObj)
        }
    }

    // send the results to server to get AI generated persona
    submitAnswers() {
        fetch('/api/persona', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.answers),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                this.generateImage(this.answers)
                document.getElementById('persona-box').innerHTML = data
            })

            .catch((error) => console.error(error))
    }

    // generate and image to go along with the persona
    async generateImage(userAnswers) {
        try {
            const response = await fetch('/api/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userAnswers),
            })

            const data = await response.json()

            if (data) {
                const imageContainer = document.getElementById('image-container')
                const img = document.createElement('img')
                img.src = data
                img.alt = 'Generated Image'
                imageContainer.innerHTML = ''
                imageContainer.appendChild(img)
            } else {
                console.error('No image URL returned')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }
}

const questionMan = new QuestionManager()
document.addEventListener('DOMContentLoaded', () => questionMan.getBatchOfQuestions())
document.getElementById('submit-btn').addEventListener('click', () => questionMan.submitAnswers())
