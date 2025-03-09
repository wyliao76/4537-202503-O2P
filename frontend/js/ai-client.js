function getQuestion() {
    fetch("/api/question", {
        method: 'POST'
    }
    )
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(JSON.stringify(data));
            document.getElementById('question').innerHTML = data;
        })
        .catch(error => {
            console.log("error", error)
        })
}

document.getElementById('question-btn').addEventListener("click", getQuestion);