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
        
        const timestamp = new Date().toLocaleTimeString();
        messageElement.innerHTML = `
            <strong>${sender}</strong>
            <span class="message-text">${message}</span>
            <span class="timestamp">${timestamp}</span>
        `;
        
        chat.appendChild(messageElement);
        chat.scrollTop = chat.scrollHeight;
    }

    // Event listener for send button
    sendButton.addEventListener("click", async () => {
        const message = messageInput.value.trim();
        if (message) {
            try {
                console.log('Attempting to send message:', message);
                await storeMessageInDatabase(message, username);
                addMessage(message, username, true);
                sendMessage(message);
                messageInput.value = "";
            } catch (error) {
                console.error("Error sending message:", error);
                showError("Failed to send message. Please check console for details.");
            }
        }
    });


    // Allow pressing "Enter" to send the message
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendButton.click();
        }
    });
    // Store message function using API
    async function storeMessageInDatabase(message, username) {
        try {
            console.log('Sending message to API:', { username, message });
            
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Make sure this header is set
                },
                body: JSON.stringify({ username, message }) // JSON.stringify to ensure JSON format
            });
            
            if (!response.ok) {
                console.error(`Failed to store message. Status: ${response.status}`);
                throw new Error('Failed to store message');
            }
            
            const responseData = await response.json();
            console.log('Message stored successfully:', responseData);
            return responseData;
        } catch (error) {
            console.error('Error storing message:', error);
            throw error;
        }
    }

    // Fetch messages function using API
    async function fetchMessagesFromDatabase() {
        try {
            const response = await fetch(`${API_URL}`);
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            
            const data = await response.json();
            
            // Ensure we are working with an array and sort by timestamp
            const messages = Array.isArray(data.body) ? data.body : [];
            messages.sort((a, b) => Number(a.Timestamp) - Number(b.Timestamp)); // Sort messages by Timestamp

            return messages;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    async function loadPreviousMessages() {
        try {
            console.log('Loading previous messages');
            const messages = await fetchMessagesFromDatabase();
            console.log('Retrieved messages:', messages);
            
            if (messages.length === 0) {
                console.log('No previous messages found');
                return;
            }

            messages.forEach(msg => {
                if (msg && msg.Username && msg.Message) {
                    const isCurrentUser = msg.Username === username;
                    console.log('Adding message:', {
                        username: msg.Username,
                        message: msg.Message,
                        isCurrentUser: isCurrentUser
                    });
                    addMessage(msg.Message, msg.Username, isCurrentUser);
                } else {
                    console.warn('Skipping invalid message:', msg);
                }
            });
            
            chat.scrollTop = chat.scrollHeight;
            console.log('Previous messages loaded successfully');
        } catch (error) {
            console.error('Error in loadPreviousMessages:', error);
            showError('Failed to load previous messages. Please check console for details.');
            throw error;
        }
    }
});
