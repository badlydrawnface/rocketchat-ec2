document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.getElementById("login-container");
    const chatContainer = document.getElementById("chat-container");
    const usernameInput = document.getElementById("username-input");
    const loginButton = document.getElementById("login-button");
    const chat = document.getElementById("chat");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");

    let username = "";
    let socket = null; // Initialize WebSocket variable

    const websocketBaseURL = "wss://ngsz4udq74.execute-api.us-east-2.amazonaws.com/production/";

    // Function to establish a WebSocket connection
    function connectWebSocket(user) {
        const websocketURL = `${websocketBaseURL}?username=${encodeURIComponent(user)}`;
        socket = new WebSocket(websocketURL);

        // Triggered when the connection is established
        socket.onopen = () => {
            console.log("Connected to WebSocket server.");
        };

        // Triggered when a message is received from the server
        socket.onmessage = (event) => {
            const messageData = JSON.parse(event.data); // Parse the received data
            const { username: sender, message } = messageData;
            console.log("Message received:", messageData);

            addMessage(message, sender, false); // Add received message to chat
        };

        // Triggered when the connection is closed
        socket.onclose = () => {
            console.log("Disconnected from WebSocket server.");
        };

        // Triggered when an error occurs
        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    // Function to send a message
    function sendMessage(message) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ action: "sendMessage", message }));
        } else {
            console.error("WebSocket is not open. Cannot send message.");
        }
    }

    // Close the WebSocket connection when the user leaves
    window.addEventListener("beforeunload", () => {
        if (socket) {
            socket.close();
        }
    });

    // Function to handle login
    loginButton.addEventListener("click", () => {
        const enteredUsername = usernameInput.value.trim();
        if (enteredUsername) {
            username = enteredUsername;
            loginContainer.style.display = "none";
            chatContainer.style.display = "flex";
            connectWebSocket(username); // Connect WebSocket after username is set
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
            addMessage(message, username, true); // Add the sender's own message
            sendMessage(message);
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
