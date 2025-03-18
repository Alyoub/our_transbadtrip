const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoxNzQyMTc4ODA0ODQxLCJ1c2VySWQiOjIsImlhdCI6MTc0MjE3ODgwNCwiZXhwIjoxNzQyMjY1MjA0fQ.HTCdQKZnwx7oNCQyM4GuSBInZ_uhCgefUbSxbBf5dTA";
const socket = new WebSocket(`ws://localhost:3000/chat?token=${token}`);

socket.addEventListener("open", () => {
  console.log("Connected to WebSocket server");
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  displayMessage(message);
});

function fetchOldMessages() {
  const receiverId = document.getElementById("receiverIdInput").value;
  if (receiverId.trim() !== "") {
    fetch(`http://localhost:3000/chat/${receiverId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(messages => {
      messages.forEach(message => displayMessage(message));
    })
    .catch(error => console.error('Error fetching old messages:', error));
  }
}

function sendMessage(text, receiverId) {
  const message = { text, receiverId: parseInt(receiverId, 10) };
  socket.send(JSON.stringify(message));
  displayMessage({ senderId: 'You', text }); // Display the sent message
}

function displayMessage(message) {
  const chatBox = document.getElementById("chatBox");
  const messageElement = document.createElement("div");
  const timestamp = new Date(message.creteadAt).toLocaleTimeString();
  messageElement.textContent = `${message.senderId} [${timestamp}]: ${message.text}`;
  chatBox.appendChild(messageElement);
}

document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById("sendButton");
  const messageInput = document.getElementById("messageInput");
  const receiverIdInput = document.getElementById("receiverIdInput");

  sendButton.addEventListener("click", () => {
    const text = messageInput.value;
    const receiverId = receiverIdInput.value;
    if (text.trim() !== "" && receiverId.trim() !== "") {
      sendMessage(text, receiverId);
      messageInput.value = "";
      receiverIdInput.value = "";
    }
  });
  receiverIdInput.addEventListener("change", fetchOldMessages);
});

