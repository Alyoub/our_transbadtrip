import { loadnhistory , fetchPlayerData} from './app.js';

let friendsBtn: NodeListOf<HTMLButtonElement> | null;
let historyBtn: NodeListOf<HTMLButtonElement> | null;
let friendsList: NodeListOf<HTMLElement> | null;
let historyList: NodeListOf<HTMLElement> | null;

export async function	setupProfilPage() {
	try
	{
		const playerData = await fetchPlayerData();
		const iPlayerName = document.getElementById('iPlayerName') as HTMLSpanElement;
		const iPlayerUsername = document.getElementById('iPlayerUsername') as HTMLSpanElement;

		if (iPlayerName)
			iPlayerName.textContent = playerData.name;
		if (iPlayerUsername)
			iPlayerUsername.textContent = playerData.login;
		const imgElement = document.querySelector('img[alt="htouil"]') as HTMLImageElement;
		if (imgElement) {
			imgElement.src = playerData.profilePicPath;
		}
		const imgElement2 = document.querySelector('.user_header_pic') as HTMLImageElement;
		if (imgElement2) {
			imgElement2.src = playerData.profilePicPath;
		}
		const coverElement = document.querySelector('.grid.grid-cols-1.grid-rows-7.row-span-2.col-span-5.gap-2.p-4.lg\\:p-6.items-center.bg-cover.bg-center.bg-no-repeat.border.border-hidden.rounded-2xl.xs\\:row-span-2.xs\\:col-span-1.faded-border') as HTMLElement;
		if (coverElement) {
			coverElement.style.backgroundImage = `url(${playerData.wallpaperPath})`;
		}
	}
	catch(error)
	{
		// console.error("Failed to update the Player's name: ", error);
	}
};

export function	setupProfilButtons() {
	const homeBtn = document.querySelector('.home-btn') as HTMLButtonElement;
	// const notifsBtn = document.getElementById('notifsBtn') as HTMLButtonElement;
	// const notifsPanel = document.getElementById('notifsPanel') as HTMLElement
	// const notifs = document.getElementById('notifs') as HTMLElement;
	// const notifsAccRejBtn = document.getElementById('notifsAccRejBtn') as HTMLButtonElement;
	const logOutBtn = document.getElementById('logOutBtn') as HTMLButtonElement;
	const logOutPanel = document.getElementById('logOutPanel') as HTMLElement;
	const rejLogOutBtn = document.getElementById('rejLogOutBtn') as HTMLButtonElement;
	const accLogOutBtn = document.getElementById('accLogOutBtn') as HTMLButtonElement;
	const settingsBtn = document.querySelector('.settings-btn') as HTMLButtonElement;
	// const addNewFriendShowBtn = document.getElementById('addNewFriendShowBtn') as HTMLButtonElement;
	// const addNewFriendCloseBtn = document.getElementById('addNewFriendCloseBtn') as HTMLButtonElement;
	// const messagesBtn = document.getElementById('messagesBtn') as HTMLButtonElement;
	const sidePanel = document.getElementById('sidePanel') as HTMLElement;
	const openSidePanelBtn = document.getElementById('openSidePanelBtn') as HTMLButtonElement;
	const closeSidePanelBtn = document.getElementById('closeSidePanelBtn') as HTMLButtonElement;
	friendsBtn = document.querySelectorAll('.friends-btn') as NodeListOf<HTMLButtonElement>;
	historyBtn = document.querySelectorAll('.history-btn') as NodeListOf<HTMLButtonElement>;
	friendsList = document.querySelectorAll('.friends-list') as NodeListOf<HTMLElement>;
	historyList = document.querySelectorAll('.history-list') as NodeListOf<HTMLElement>;
	const localBtn = document.getElementById('local-btn') as HTMLButtonElement;
	const onlineBtn = document.getElementById('online-btn') as HTMLButtonElement;
	const playSolo = document.getElementById('playSolo') as HTMLButtonElement;
	const play1v1Btn = document.getElementById('play1v1Btn') as HTMLButtonElement;
	const play2v2Btn = document.getElementById('play2v2Btn') as HTMLButtonElement;
	// const playWFriendsBtn = document.getElementById('playWFriendsBtn') as HTMLButtonElement;
	const tournTitle = document.getElementById('tournTitle') as HTMLElement;
	const createTournPageBtn = document.getElementById('createTournPageBtn') as HTMLButtonElement;
	// const hostTournPageBtn = document.getElementById('hostTournPageBtn') as HTMLButtonElement;

	homeBtn.addEventListener('click', () => loadnhistory('profil'));
	// notifsBtn.addEventListener('click', (event) => showNotifications(event, notifsPanel));
	// notifsAccRejBtn.addEventListener('click', (event) => showNotifsAccRej(event, notifs, notifsAccRejBtn));
	logOutBtn.addEventListener('click', (event) => showLogOutPopup(event, logOutPanel));
	rejLogOutBtn?.addEventListener('click', () => {
		logOutPanel?.classList.remove('flex');
		logOutPanel?.classList.add('hidden');
	});
	accLogOutBtn?.addEventListener('click', async () => {
		try
		{
			const response = await fetch(`${window.location.origin}/api/logout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({}),
				credentials : 'include'
			});
			if (!response.ok)
				throw new Error("Failed to request log out");
			loadnhistory('home');
		}
		catch (error)
		{
			// console.error("Failed to log out: ", error);
		}
	});
	settingsBtn.addEventListener('click', () => loadnhistory('settings'));
	// addNewFriendShowBtn?.addEventListener('click', () => showAddNewFriendPopup(sidePanel));
	// addNewFriendCloseBtn?.addEventListener('click', () => closeAddNewFriendPopup(sidePanel));
	// messagesBtn?.addEventListener('click', () => loadnhistory('messages'));
	openSidePanelBtn?.addEventListener('click', (event) => openSidePanel(event, sidePanel));
	closeSidePanelBtn?.addEventListener('click', (event) => closeSidePanel(event, sidePanel));
	document.addEventListener('click', (event) => panelOutsideClick(event, sidePanel));
	friendsBtn?.forEach((element) => {
		element.addEventListener('click', showFriendsList);
	});
	historyBtn?.forEach((element) => {
		element.addEventListener('click', showHistoryList);
	});
	localBtn?.addEventListener('click', () => selectLocal(localBtn, onlineBtn, tournTitle, createTournPageBtn, playSolo, play2v2Btn));
	onlineBtn?.addEventListener('click', () => selectOnline(localBtn, onlineBtn, tournTitle, createTournPageBtn, playSolo, play2v2Btn));
	playSolo?.addEventListener('click', () => loadnhistory('game_ai'));
	play1v1Btn?.addEventListener('click', () => {
		if (localBtn?.classList.contains('bg-gray-600'))
			loadnhistory('game_local');
		else
			loadnhistory('GameOnline');
	});
	play2v2Btn?.addEventListener('click', () => loadnhistory('game_multi'));
	createTournPageBtn?.addEventListener('click', () => loadnhistory('createtourn'));
	// hostTournPageBtn?.addEventListener('click', () => loadnhistory('hosttourn'));
};

function	showLogOutPopup(event: Event, logOutPanel: HTMLElement) {
	event?.stopPropagation();
	if (logOutPanel.classList.contains('hidden'))
	{
		logOutPanel?.classList.remove('hidden');
		logOutPanel?.classList.add('flex');
		document.addEventListener('click', (event) => logOutPanelOutsideClick(event, logOutPanel));
	}
	else
	{
		logOutPanel?.classList.add('hidden');
		logOutPanel?.classList.remove('flex');
	}
};

function	logOutPanelOutsideClick(event: Event, logOutPanel: HTMLElement) {
	event?.stopPropagation();
	if (!logOutPanel.contains(event.target as Node))
	{
		logOutPanel?.classList.remove('flex');
		logOutPanel?.classList.add('hidden');
	}
};

// function	showNotifications(event: Event, notifsPanel: HTMLElement) {
// 	event?.stopPropagation();

// 	if (notifsPanel.classList.contains('hidden'))
// 	{
// 		notifsPanel.classList.remove('hidden');
// 		notifsPanel.classList.add('flex');
// 		document.addEventListener('click', (event) => notifsOutsideClick(event, notifsPanel));
// 		document.addEventListener('scroll', (event) => {
// 			if (!notifsPanel.contains(event.target as Node))
// 			{
// 				notifsPanel.classList.remove('flex');
// 				notifsPanel.classList.add('hidden');
// 			}
// 		});
// 	}
// 	else
// 	{
// 		notifsPanel.classList.remove('flex');
// 		notifsPanel.classList.add('hidden');
// 	}
// };

// function	showNotifsAccRej(event: Event, notifs: HTMLElement, notifsAccRejBtn: HTMLButtonElement) {
// 	event?.stopPropagation();
// 	const notifsaccRejBox = document.getElementById('notifsaccRejBox') as HTMLElement;
// 	const notifsText = document.getElementById('notifsText') as HTMLParagraphElement

// 	if (notifsaccRejBox.classList.contains('translate-x-full'))
// 	{
// 		notifsaccRejBox.classList.remove('translate-x-full', 'opacity-0');
// 		notifsText.classList.add('opacity-0');
// 		notifsAccRejBtn.classList.add('rotate-180');
// 		notifs.addEventListener('scroll', () => {
// 			// event.stopPropagation();
// 			// event.preventDefault();
// 			notifsaccRejBox.classList.add('translate-x-full', 'opacity-0');
// 			notifsText.classList.remove('opacity-0');
// 			notifsAccRejBtn.classList.remove('rotate-180');
// 		});
// 	}
// 	else
// 	{
// 		notifsaccRejBox.classList.add('translate-x-full', 'opacity-0');
// 		notifsText.classList.remove('opacity-0');
// 		notifsAccRejBtn.classList.remove('rotate-180');
// 	}
// };

// function	showAddNewFriendPopup(sidePanel: HTMLElement) {
// 	const toBlur = document.getElementById('toBlur') as HTMLElement;
// 	const toPop = document.getElementById('toPop') as HTMLElement;

// 	if (toBlur)
// 		toBlur.inert = true;
// 	toBlur.classList.add('blur-sm');
// 	toPop.classList.remove('hidden');
// 	toPop.classList.add('flex');
// 	sidePanel?.classList.remove('block');
// 	sidePanel?.classList.add('hidden');
// };

// function	closeAddNewFriendPopup(sidePanel: HTMLElement) {
// 	const toBlur = document.getElementById('toBlur') as HTMLElement;
// 	const toPop = document.getElementById('toPop') as HTMLElement;

// 	if (toBlur)
// 		toBlur.inert = false;
// 	toBlur.classList.remove('blur-sm');
// 	toPop.classList.add('hidden');
// 	toPop.classList.remove('flex');
// 	sidePanel?.classList.add('block');
// 	sidePanel?.classList.remove('hidden');
// };

function	selectLocal(localBtn: HTMLButtonElement, onlineBtn: HTMLButtonElement, tournTitle:HTMLElement, createTournPageBtn: HTMLButtonElement, playSolo: HTMLButtonElement, play2v2Btn:HTMLButtonElement) {
	localBtn?.classList.add('bg-gray-600');
	localBtn?.classList.remove('hover:bg-gray-500');
	onlineBtn?.classList.add('hover:bg-gray-500');
	onlineBtn?.classList.remove('bg-gray-600');
	playSolo?.classList.remove('opacity-30');
	playSolo.inert = false;
	play2v2Btn?.classList.remove('opacity-30');
	play2v2Btn.inert = false;
	tournTitle?.classList.remove('opacity-30');
	createTournPageBtn.inert = false;
	createTournPageBtn?.classList.remove('opacity-30');
	// if (hostTournPageBtn)
	// 	hostTournPageBtn.inert = true;
	// hostTournPageBtn?.classList.add('opacity-30');
};

function	selectOnline(localBtn: HTMLButtonElement, onlineBtn: HTMLButtonElement, tournTitle:HTMLElement, createTournPageBtn: HTMLButtonElement, playSolo: HTMLButtonElement, play2v2Btn:HTMLButtonElement) {
	onlineBtn?.classList.add('bg-gray-600');
	onlineBtn?.classList.remove('hover:bg-gray-500');
	localBtn?.classList.add('hover:bg-gray-500');
	localBtn?.classList.remove('bg-gray-600');
	playSolo?.classList.add('opacity-30');
	playSolo.inert = true;
	play2v2Btn?.classList.add('opacity-30');
	play2v2Btn.inert = true;
	tournTitle?.classList.add('opacity-30');
	createTournPageBtn.inert = true;
	createTournPageBtn?.classList.add('opacity-30');
	// if (hostTournPageBtn)
	// 	hostTournPageBtn.inert = false;
	// hostTournPageBtn?.classList.remove('opacity-30');
};

function	openSidePanel(event: Event, sidePanel: HTMLElement) {
	event?.stopPropagation();
	sidePanel?.classList.remove('translate-x-full');
	// document.body.classList.add('overflow-hidden');
	showFriendsList();
};

function	closeSidePanel(event: Event, sidePanel: HTMLElement) {
	event?.stopPropagation();
	sidePanel?.classList.add('translate-x-full');
	// document.body.classList.remove('overflow-hidden');
};

function	panelOutsideClick(event: Event, sidePanel: HTMLElement) {
	if (sidePanel && !sidePanel.contains(event.target as Node))
		closeSidePanel(event, sidePanel);
};

function	showFriendsList() {
	friendsList?.forEach((element) => {
		element?.classList.remove('hidden');
	});
	friendsBtn?.forEach((element) => {
		element?.classList.remove('panel-btn');
		element?.classList.add('selected-panel-btn');
	});
	historyList?.forEach((element) => {
		element?.classList.add('hidden');
	});
	historyBtn?.forEach((element) => {
		element?.classList.add('panel-btn');
		element?.classList.remove('selected-panel-btn');
	});
};

function	showHistoryList() {
	historyList?.forEach((element) => {
		element?.classList.remove('hidden');
	});
	historyBtn?.forEach((element) => {
		element?.classList.remove('panel-btn');
		element?.classList.add('selected-panel-btn');
	});
	friendsList?.forEach((element) => {
		element?.classList.add('hidden');
	});
	friendsBtn?.forEach((element) => {
		element?.classList.add('panel-btn');
		element?.classList.remove('selected-panel-btn');
	});
};
