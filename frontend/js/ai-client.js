
class QuestionManager {
    constructor() {
        this.question = {};
    }

    getQuestion() {
        fetch("/api/question", {
            method: 'POST'
        }
        )
            .then(response => {
                return response.json();
            })
            .then(data => {
                data = JSON.stringify(data);
                this.question = this.parseResponse(data);
                this.displayQuestion();
            })
            .catch(error => {
                console.log("error", error)
            })
    }

    displayQuestion() {
        document.getElementById('question').innerHTML = this.question.question;
        const answerList = document.getElementById("answer-list");
        answerList.innerHTML = "";

        for(let i = 0; i < 4; i++) {
            const li = document.createElement("li");
            li.textContent = this.question[String.fromCharCode(65 + i)];
            answerList.appendChild(li);
        }
    }
    
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
}

const questionMan = new QuestionManager();

document.getElementById('question-btn').addEventListener("click", () => questionMan.getQuestion());