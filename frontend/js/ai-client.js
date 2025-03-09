
class QuestionManager {
    constructor() {
        this.questionBatch = []; // array to store all questions
        this.numOfQuestions = 3; // number of questions to generate. ATM prompt would have to be changed too.
    }

    // make a request to server to propmt AI for questions
    getBatchOfQuestions() {
        fetch("/api/questionBatch", {
            method: 'POST'
        }
        )
            .then(response => {
                return response.json();
            })
            .then(data => {
                data = JSON.stringify(data);
                console.log(data);
                this.separateQuestions(data); // parse questions from API response
                this.displayAllQuestions(); // display all questions on DOM
            })
            .catch(error => {
                console.log("error", error)
            })
    }

    // Seperate delimited questions from API response
    separateQuestions(response) {
        const cleanedResponse = response.replace(/\\"/g, '').replace(/\\n/g, ' ').trim();
    
        for (let i = 0; i < this.numOfQuestions; i++) {
            let startIndex = cleanedResponse.indexOf(`${i + 1}:`);
            if (startIndex !== -1) {
                startIndex += 1;
            }

            let endIndex = cleanedResponse.indexOf(`${i + 2}:`);
            if (endIndex === -1) {
                endIndex = cleanedResponse.length;
            }

            // add each question to questionBatch array as question object
            const questionString = cleanedResponse.substring(startIndex, endIndex).trim();
            this.questionBatch.push(this.parseResponse(questionString));

        }
    }

    // parse individual fields of a question and return question object
    parseResponse(response) {
        const cleanedResponse = response.replace(/\\"/g, '').replace(/\\n/g, ' ').trim();
    
        const question = cleanedResponse.substring(1, cleanedResponse.indexOf("A)")).trim();
    
        const answer1 = cleanedResponse.substring(cleanedResponse.indexOf("A)"), cleanedResponse.indexOf("B)")).trim();
        const answer2 = cleanedResponse.substring(cleanedResponse.indexOf("B)"), cleanedResponse.indexOf("C)")).trim();
        const answer3 = cleanedResponse.substring(cleanedResponse.indexOf("C)"), cleanedResponse.indexOf("D)")).trim();
        const answer4 = cleanedResponse.substring(cleanedResponse.indexOf("D)"), cleanedResponse.length - 1).trim();
    
        const questionObj = {
            question: question,
            A: answer1,
            B: answer2,
            C: answer3,
            D: answer4,
        };
    
        return questionObj;
    }

    // display formatted questions on HTML
    displayAllQuestions() {
        // clear space where the questions go
        const questionBatchArea = document.getElementById("question-batch");
        questionBatchArea.innerHTML = "";

        // for each question, create a p tag for question, create a list
        // and append list item for each possible answer
        for(let i = 0; i < this.questionBatch.length; i++) {
            let p = document.createElement("p");
            p.textContent = this.questionBatch[i].question;
            let ul = document.createElement("ul");
            questionBatchArea.append(p);
            questionBatchArea.append(ul);
            for(let j = 0; j < 4; j++) {
                let li = document.createElement("li");
                li.textContent = this.questionBatch[i][String.fromCharCode(65 + j)];
                ul.appendChild(li);
            }
        }

    }
    
}

const questionMan = new QuestionManager();

document.getElementById('question-btn').addEventListener("click", () => questionMan.getQuestion());
document.getElementById('batch-btn').addEventListener("click", () => questionMan.getBatchOfQuestions());