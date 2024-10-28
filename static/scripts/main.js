document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.getElementById("login-container");
    const chatContainer = document.getElementById("chat-container");
    const usernameInput = document.getElementById("username-input");
    const loginButton = document.getElementById("login-button");
    const chat = document.getElementById("chat");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");

    let username = "";

    // Function to handle login
    loginButton.addEventListener("click", () => {
        const enteredUsername = usernameInput.value.trim();
        if (enteredUsername) {
            username = enteredUsername;
            loginContainer.style.display = "none";
            chatContainer.style.display = "flex";
        }
    });

    // Function to add a message to the chat
    function addMessage(message, sender, isRightAligned) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", isRightAligned ? "message-right" : "message-left");
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chat.appendChild(messageElement);
        chat.scrollTop = chat.scrollHeight;
    }

    // Event listener for send button
    sendButton.addEventListener("click", () => {
        const message = messageInput.value.trim();
        if (message) {
            addMessage(message, username, true); // Always use 'false' for left alignment

            messageInput.value = ""; // Clear input field after sending
        }
    });
    

    // Allow pressing "Enter" to send the message
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendButton.click();
        }
    });
});
