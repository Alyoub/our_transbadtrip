const socket = new WebSocket(`ws://localhost:3000/chat?token=${get_token_from_cookies()}`);
// console.log("hamiid")

socket.addEventListener('open', function () {
    console.log('Connected to WebSocket server');
});

socket.addEventListener('message', function (event) {
    console.log("Received message:", event.data);
    try {
        const message = JSON.parse(event.data);
        if (message.error) {
            console.error(message.error);
            return;
        }
        appendMessage(message.senderId, message.text);
    } catch (error) {
        console.error("Error parsing message:", error);
    }
});

socket.addEventListener('close', function (event) {
    console.log('WebSocket connection closed:', event);
});

socket.addEventListener('error', function (error) {
    console.error('WebSocket error:', error);
});

document.getElementById('sendButton').addEventListener('click', function(event) {
    event.preventDefault()
    const messageInput = document.getElementById('messageInput');
    const receiverIdInput = document.getElementById('receiverIdInput');
    
    const message = {
        text: messageInput.value.trim(),
        receiverId: parseInt(receiverIdInput.value)
    };
    
    if (!message.text || isNaN(message.receiverId)) return;
    
    socket.send(JSON.stringify(message));
    appendMessage('Me', message.text);
    messageInput.value = '';

});
// Add enter key support for the input field
document.getElementById('messageInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('sendButton').click();
    }
});

function appendMessage(sender, text) {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${text}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
}

function get_token_from_cookies() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; jwt=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

let letoken = get_token_from_cookies();
console.log(letoken);

fetch('http://localhost:3000/users', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${letoken}`
    },
    credentials: 'include'
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(friends => {
    if (!Array.isArray(friends)) {
        throw new Error('Expected an array of friends');
    }
    const friendos = document.getElementById('friendoss');
    friendos.innerHTML = ''; // Clear existing content
    friends.forEach(friend => {
        const friendElement = document.createElement('div');
        friendElement.className = 'user_continer';
        friendElement.innerHTML = `
        <div class="picholder">
        <img class="userpic" src="feline.webp">
        </div>
        <div class="textHolder">
        <label class="userName">
                ${friend.login}
            </label>
            <p class="messg">
                last message to be added
            </p>
          </div>
        `;
        friendElement.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            loadConversation(friend);
        });
        friendos.appendChild(friendElement);
    });
})
.catch(error => {
    console.error('Error fetching users:', error);
});

function loadConversation(friend) {
    document.getElementById('receiverIdInput').value = friend.id;
    fetch(`http://localhost:3000/chat/${friend.login}`, {
        method: 'POST',
        headers: {
            // 'Authorization': `Bearer ${letoken}`
        },
        credentials: 'include'
    })
    .then(response => response.json())
    .then(messages => {
        const chatBox = document.getElementById('chatBox');
        chatBox.innerHTML = '';
        if (Array.isArray(messages)) {
            messages.forEach(message => {
                appendMessage(message.senderId === friend.id ? friend.login : 'Me', message.text);
            });
        }
    })
    .catch(error => console.error('Error loading conversation:', error));
}