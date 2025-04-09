import { loadnhistory, fetchPlayerData } from "./app.js";

export async function	setupProfilePage() {

    const headerPic = document.querySelector('.user_header_pic') as HTMLImageElement;

	try
	{
		const playerData = await fetchPlayerData();

		const iPlayerUsername = document.getElementById('iPlayerUsername') as HTMLSpanElement;

        // const picplayer = document.querySelector('.pfp') as HTMLImageElement;

		if (headerPic)
        {
			iPlayerUsername.textContent = playerData.login;
			headerPic.src = playerData.profilePicPath;
        }

	}
	catch(error)
	{
		// console.error("Failed to update the Player's name: ", error);
	}
	
};

export function profile()
{

	const localHTMLgen = `

		<button class="soloBtn">
		Play Solo
		</button>
		<button class="onevsone">
		1 VS 1
		</button>
		<button class="towvstow">
		2 VS 2
		</button>
		<button class="tournament">
		Tournament
		</button>

	`;

	const onlineHTMLgen = `
		<button class="soloBtn">
			1 VS 1
		</button>
	`;

	function switchMode()
	{
		const localbrtn = document.getElementById('localBtn') as HTMLButtonElement;
		const modeSide = document.getElementById('modeSide') as HTMLElement;

		const onlinebtn = document.getElementById('OnlineBtn') as HTMLButtonElement;

		localbrtn.classList.add('linecool');
		modeSide.innerHTML = localHTMLgen;

		localbrtn.addEventListener('click', () => {
			// console.log('nadi');
			localbrtn.classList.add('linecool');
			onlinebtn.classList.remove('linecool');
			modeSide.innerHTML = localHTMLgen;

		});
		onlinebtn.addEventListener('click', () => {
			localbrtn.classList.remove('linecool');
			onlinebtn.classList.add('linecool');
			modeSide.innerHTML = onlineHTMLgen;
		});

	}
	switchMode();

	function navig() : void
	{
		const setttings = document.querySelector('.setttings') as HTMLElement;

		const solo = document.querySelector(".soloBtn") as HTMLButtonElement; 
		const oneVsone = document.querySelector(".onevsone") as HTMLButtonElement; 
		const towVstow = document.querySelector(".towvstow") as HTMLButtonElement; 
		const tournament = document.querySelector(".tournament") as HTMLButtonElement; 

		setttings.addEventListener('click', () => {
			loadnhistory('settings');
		});

		solo.addEventListener('click', () => {
			loadnhistory('game_ai');
		});

		oneVsone.addEventListener('click', () => {
			loadnhistory('game_local');
		});

		towVstow.addEventListener('click', () => {
			loadnhistory('game_multi');
		});

		tournament.addEventListener('click', () => {
			loadnhistory('createtourn');
		});

	}
	navig();

	function SetUserData()  : void
	{
		const profilepic = document.querySelector('.DashPic') as HTMLImageElement;
		const profileCover = document.querySelector('.DashCover') as HTMLImageElement;
		const userName = document.querySelector('.userText') as HTMLSpanElement;

		const level = document.getElementById('levelScore') as HTMLSpanElement;
		const wins = document.querySelector('.winsScor') as HTMLElement;
		const Lose = document.querySelector('.LoseScor') as HTMLElement;

		fetch(`${window.location.origin}/api/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials : "include"
        })
        .then(response => response.json())
        .then(data => {
			console.log(data);

			profileCover.src = data.wallpaperPath;
			profilepic.src = data.profilePicPath;
			userName.textContent = data.name;
			level.textContent = data.level;
			wins.textContent = data.wonGames;
			Lose.textContent = data.lostGames;
        })
	}
	SetUserData();

	function GetUsers(): void {
		const input = document.querySelector('.find') as HTMLInputElement;
		const friendBlock = document.querySelector('.friendsRecs') as HTMLElement;
	
		fetch(`${window.location.origin}/api/users`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
			.then(response => response.json())
			.then(data => {
				interface User {
					login: string;
					name: string;
					profilePicPath : string;
					id : number;
				}
				// console.log(data);
				const users: User[] = data;

				input.addEventListener('input', () => {
					const searchValue = input.value.toLowerCase();
					friendBlock.innerHTML = '';
	
					users.forEach((user: User) => {
						if (user.login.toLowerCase() === searchValue)
						{
							friendBlock.innerHTML += `
								<div class="userContiner1">
									<img class="userPic" src="${user.profilePicPath}">
									<label class="userName1">${user.login}</label>
									<button id="send" class="btn1">
                                    <span class="text">Send Request</span>
                                	</button>
								</div>
							`;
							sendRec(user.id);
						}
					});
				});


			});
	}
	
	GetUsers();


	function sendRec(Id : number): void
	{
		const sendBtn = document.getElementById('send') as HTMLButtonElement;

		const bnttext = document.querySelector('.text') as HTMLSpanElement;

			sendBtn.addEventListener('click', () => {
				bnttext.textContent = "Request Sent";
				sendBtn.disabled = true;
				sendBtn.classList.add('wasSent');

				const UserID = {
					friendId : Id
				}

				fetch(`${window.location.origin}/api/friends/add`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(UserID),
                    credentials : "include"
				})
					.then(response => response.json())
					.then(data => {

						console.log(data);
					})
			});
	}

	function friendsrecList()
	{
		const reclist = document.querySelector('.ListData') as HTMLDivElement;

		fetch(`${window.location.origin}/api/friends/requests`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({}),
			credentials: 'include'
		})
		.then(response => response.json())
		.then(data => {

			data.requests.forEach((request: any) => {
				const user = request.user;


				const userContainer = document.createElement('div');
				userContainer.classList.add('userContiner');

				const img = document.createElement('img');
				img.classList.add('userPic');
				img.src = user.profilePicPath || '../public/profile_pictures/ProfilePic.jpeg'; // fallback

		
				const label = document.createElement('label');
				label.classList.add('userName');
				label.textContent = user.login;


				const button = document.createElement('button');
				button.classList.add('btn');

				const span = document.createElement('span');
				span.classList.add('text');
				span.textContent = 'Play';

				button.appendChild(span);


				userContainer.appendChild(img);
				userContainer.appendChild(label);
				userContainer.appendChild(button);


				reclist.appendChild(userContainer);
			});
		})
		.catch(err => {
			console.error("Error fetching requests:", err);
		});
	}
	friendsrecList();


}


export function logOut() : void 
	{
		const logBtn = document.querySelector('.logout') as HTMLDivElement;

		const headerbtn = document.querySelector('.sign-bt_notif') as HTMLDivElement;
		const card = document.querySelector('.loader') as HTMLElement;

		const allprofileData = document.querySelector('.allprofileData') as HTMLDivElement ;

		headerbtn.addEventListener('click', () => {
			logBtn.style.display = "";
		});

		logBtn.addEventListener('click', () => {

			fetch(`${window.location.origin}/api/logout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({}),
				credentials : "include"
			})
			allprofileData.classList.add('blur');
			card.style.display = "";
				setTimeout(() =>
				{
					loadnhistory('home');
				}, 3000);
			
		});

	}

// <div class="userContiner">
// 	<img class="userPic" src="../public/profile_pictures/ProfilePic.jpeg">
// 	<label class="userName">
// 		Alotfi
// 	</label>
// 	<button class="btn">
// 		<span class="text">Play</span>
// 	</button>
// </div>
