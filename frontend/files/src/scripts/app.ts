import {
	notificationHeader1,
	notificationHeader2,
	simpleHeader,
	newFriendRequestTag,
	oldFriendTag,
	matchScoreTag,
	sideNewFriendRequestTag,
	sideOldFriendTag,
	sideMatchScoreTag,
	friendToTournamentTag,
} from './components.js';
import { updateHomeHeadermain3 } from "./home1.js";
import { updateHomeHeadermain5 , setupLoginPage } from "./home2.js";
import { setupProfilPage , setupProfilButtons } from "./profil.js";
import { updateSettingsPage } from "./settings.js";
import { rakmanchat } from "./chat.js";
import { setupSoloPage , GameAi } from "./GameAI.js";
import { setupLocalPage , GameLocal } from "./GameLocal.js";
import { setupMultiPage , GameMulti } from "./GameMulti.js";
import { setupCreateTournamentPage , tournamentPlayers , setupCreateTournamentButtons } from './createtourn.js';
import { setupTournamentPage , tournament } from './tournament.js';
import {GameOnline2 } from './GameOnline.js'
let app: HTMLElement;

document.addEventListener('DOMContentLoaded', () => {
	
	const urlParams = new URLSearchParams(window.location.search);
	const initialPage = urlParams.get('page') || 'home';

	const Error = '404';
	const Home = 'home';

	fetch(`${window.location.origin}/api/access`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({}),
		credentials : "include"
	})
	.then(response => response.json())
	.then(data => {
		console.log("Success:", data.message);

		if(data.message === "OK!")
		{
			app = document.getElementById('app')!;
			initiateCustomTags();
			history.replaceState({ page: initialPage }, '', `?page=${initialPage}`);
			loadPage(initialPage);
			window.onpopstate = (event: PopStateEvent) => {
				if (event.state?.page)
					loadPage(event.state.page);
			};
		}
		if(initialPage === 'home')
		{
			app = document.getElementById('app')!;
			initiateCustomTags();
			history.replaceState({ page: Home }, '', `?page=${Home}`);
			loadPage(Home);
			window.onpopstate = (event: PopStateEvent) => {
				if (event.state?.page)
					loadPage(event.state.page);
			};
		}
		if(data.error === "Unauthorized" && initialPage !== 'home')
		{
			app = document.getElementById('app')!;
			initiateCustomTags();
			history.replaceState({ page: Error }, '', `?page=${Error}`);
			loadPage(Error);
			window.onpopstate = (event: PopStateEvent) => {
				if (event.state?.page)
					loadPage(event.state.page);
			};
		}
	})
});

function initiateCustomTags() {
	customElements.define('notification-header1', notificationHeader1);
	customElements.define('notification-header2', notificationHeader2);
	customElements.define('simple-header', simpleHeader);
	customElements.define('newfriendrequest-tag', newFriendRequestTag);
	customElements.define('oldfriend-tag', oldFriendTag);
	customElements.define('matchscore-tag', matchScoreTag);
	customElements.define('sidenewfriendrequest-tag', sideNewFriendRequestTag);
	customElements.define('sideoldfriend-tag', sideOldFriendTag);
	customElements.define('sidematchscore-tag', sideMatchScoreTag);
	customElements.define('friendtotournament-tag', friendToTournamentTag);
};

async function loadPage(page: string) {
	try {
		const header = document.getElementById('header') as HTMLHeadElement;
		const response = await fetch(`pages/${page}.html`);
		const content = await response.text();
		app.innerHTML = content;
		console.log(`nav to: ${page}`);
		// changePageBackground(page);
		if (page === 'home')
		{
			setupHomePage();
			setupLoginPage();
		}
		if (page === 'profil')
		{
			setupProfilPage();
			setupProfilButtons();
		}
		if (page === 'messages')
		{
			// setupMessagesButtons();
			rakmanchat();
		}
		if (page === 'createtourn')
		{
			setupCreateTournamentPage();
			setupCreateTournamentButtons();
		}
		if (page === 'tournament')
		{
			// console.log(`tournamentPlayers: ${tournamentPlayers}`);
			setupTournamentPage();
			tournament(tournamentPlayers);
		}
		if (page === 'settings')
		{
			updateSettingsPage();
		}
		if (page === 'game_ai')
		{
			setupSoloPage();
			GameAi();
		}
		if (page === 'game_local')
		{
			setupLocalPage();
			GameLocal();
		}
		if (page === 'game_multi')
		{
			setupMultiPage();
			GameMulti();
		}
		if(page === 'GameOnline'){
			GameOnline2();
			header.innerHTML = "<notification-header></notification-header>";
		}
	}
	catch (error)
	{
		app.innerHTML = `<p class="text-red-500">Page not found.</p>`;
	}
};

function changePageBackground(page: string) {
	if (page === 'home')
		document.body.classList.remove('bg-fixed', 'bg-cover', 'bg-gradient-to-b', 'from-bgclrstart', 'to-bgclrend');
	else
		document.body.classList.add('bg-fixed', 'bg-cover', 'bg-gradient-to-b', 'from-bgclrstart', 'to-bgclrend');
};

export function loadnhistory(toLoad: string) {
	loadPage(toLoad);
	history.pushState({ page: toLoad }, '', `?page=${toLoad}`);
};

export async function	fetchPlayerData() {
	try
	{
		const response = await fetch(`${window.location.origin}/api/profile`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials : 'include'
		});

		if (!response.ok)
			throw new Error("Failed to fetch for the player's Data");
        const data = await response.json();
        console.log("data: ", data);

		return (data);
	}
	catch (error)
	{
		console.error("Failed to fetch for the player's name: ", error);
	}
};


//Home page:
function setupHomePage() {
	updateHomeHeadermain3();
	updateHomeHeadermain5();
}
