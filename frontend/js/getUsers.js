// JUST A TEST FUNCTION

function populateUsers() {
    fetch("/api/users")
        .then(response => response.json())
        .then(users => {
            const userList = document.getElementById("user-list");
            users.forEach(user => {
                const li = document.createElement("li");
                li.textContent = `${user.email} - ${user.role}`;
                userList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching users:", error));
}

document.addEventListener("DOMContentLoaded", populateUsers);
