export function rakmanchat()
{
    // console.log('we');

interface Message {
    senderId: number | string;
    text: string;
}

interface Friend {
    id: number;
    login: string;
}


const socket = new WebSocket(`ws://localhost:3000/chat?token=${get_token_from_cookies()}`);

socket.addEventListener('open', () => {
    console.log('Connected to WebSocket server');
});

socket.addEventListener('message', (event: MessageEvent) => {
    console.log("Received message:", event.data);
    try {
        const message: Message & { error?: string } = JSON.parse(event.data);
        if (message.error) {
            console.error(message.error);
            return;
        }
        appendMessage(message.senderId.toString(), message.text);
    } catch (error) {
        console.error("Error parsing message:", error);
    }
});

socket.addEventListener('close', (event: CloseEvent) => {
    console.log('WebSocket connection closed:', event);
});

socket.addEventListener('error', (error: Event) => {
    console.error('WebSocket error:', error);
});

document.getElementById('sendButton')?.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();
    const messageInput = document.getElementById('messageInput') as HTMLInputElement;
    const receiverIdInput = document.getElementById('receiverIdInput') as HTMLInputElement;

    const message: Message & { receiverId: number, senderId: number | string } = {
        text: messageInput.value.trim(),
        receiverId: parseInt(receiverIdInput.value),
        senderId: 1, // Replace with the appropriate senderId value
    };

    if (!message.text || isNaN(message.receiverId)) return;

    socket.send(JSON.stringify(message));
    appendMessage('Me', message.text);
    messageInput.value = '';
});

// Add enter key support for the input field
document.getElementById('messageInput')?.addEventListener('keypress', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('sendButton')?.click();
    }
});

function appendMessage(sender: string, text: string): void {
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return;

     const messageElement = document.createElement('div');
    
    console.log("hamada");

     if(sender === "Me")
    {
        messageElement.classList.add("ME");
    }
    else
    {
        messageElement.classList.add("User");
    }

    messageElement.textContent = `${text}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
}

function get_token_from_cookies(): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; jwt=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

const letoken = get_token_from_cookies();
console.log(letoken);

fetch(`${window.location.origin}/api/users`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${letoken}`
    },
    credentials: 'include',
})
    .then((response: Response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((friends: Friend[]) => {
        if (!Array.isArray(friends)) {
            throw new Error('Expected an array of friends');
        }
        const friendos = document.getElementById('friendoss');
        if (!friendos) return;

        friends.forEach((friend: Friend) => {
            const friendElement = document.createElement('div');
        //     const header = document.querySelector('.toukman') as HTMLElement;

        //     header.innerHTML = `
        //           <div class="user__container1">
		// 	<div class="user">
		// 		<div>
        //             <img class="image" src="../public/profile_pictures/atoukmat.jpeg">
        //         </div>
		// 		<div class="user__content">
		// 			<div class="text">
		// 				<span class="name1">${friend.login}</span>
		// 				<p class="username1">${friend.id}</p>
		// 			</div>
		// 		</div>
		// 	</div> 
		// </div>  
        //     `;

            friendElement.className = 'user_continer';
            // friendElement.innerHTML = `
            //     <div class="picholder">
            //         <img class="userpic" src="../public/profile_pictures/ProfilePic.jpeg">
            //     </div>
            //     <div class="textHolder">
            //         <label class="userName">
            //             ${friend.login}
            //         </label>
            //         <p class="messg">
            //             last message to be added
            //         </p>
            //     </div>        
            // `;
            friendElement.innerHTML = `
                <div class="user__container">
			<div class="user">
				<div>
                    <img class="image" src="../public/profile_pictures/atoukmat.jpeg">
                </div>
				<div class="user__content">
					<div class="text">
						<span class="name">${friend.login}</span>
						<p class="username">${friend.id}</p>
					</div>
				</div>
			</div> 
		</div> 
            `;
            friendElement.addEventListener('click', (event: MouseEvent) => {
                event.preventDefault(); // Prevent default link behavior
                loadConversation(friend);
            });
            friendos.appendChild(friendElement);
        });
    })
    .catch((error: Error) => {
        console.error('Error fetching users:', error);
    });

function loadConversation(friend: Friend): void {
    const receiverIdInput = document.getElementById('receiverIdInput') as HTMLInputElement;
    if (!receiverIdInput) return;

    receiverIdInput.value = friend.id.toString();
    fetch(`http://localhost:3000/chat/${friend.login}`, {
        method: 'POST',
        headers: {
            // 'Authorization': `Bearer ${letoken}`
        },
        credentials: 'include',
    })
        .then((response: Response) => response.json())
        .then((messages: Message[]) => {
            const chatBox = document.getElementById('chatBox');
            if (!chatBox) return;

            chatBox.innerHTML = '';
            if (Array.isArray(messages)) {
                messages.forEach((message: Message) => {
                    appendMessage(message.senderId === friend.id ? friend.login : 'Me', message.text);
                });
            }
        })
        .catch((error: Error) => console.error('Error loading conversation:', error));
}
}