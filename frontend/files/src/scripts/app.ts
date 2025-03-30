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

let app: HTMLElement;
let navBar: HTMLElement | null;
let navBtns: NodeListOf<HTMLButtonElement> | null;

document.addEventListener('DOMContentLoaded', () => {
	const urlParams = new URLSearchParams(window.location.search);
    const initialPage = urlParams.get('page') || 'home';

	app = document.getElementById('app')!;
	navBar = document.querySelector('nav');
	navBtns = document.querySelectorAll('.nav-btn');

	// console.log(`here:`);
	initiateCustomTags();
	history.replaceState({ page: initialPage }, '', `?page=${initialPage}`);
	loadPage(initialPage);
	navBtns.forEach((button: HTMLElement) => {
		button.addEventListener('click', () => {
			const page = button.dataset.page!;
			loadPage(page);
			history.pushState({ page }, '', `?page=${page}`);
		});
	});
	window.onpopstate = (event: PopStateEvent) => {
		// console.log(`load: ${event.state?.page}`);
		if (event.state?.page)
		{
			loadPage(event.state.page);
		}
	};
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
		hideNav(page);
		changePageBackground(page);
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
		if(page === 'home1')
		{
			header.innerHTML = "";
		}
	}
	catch (error)
	{
		app.innerHTML = `<p class="text-red-500">Page not found.</p>`;
	}
};

function hideNav(page: string) {
	if (navBar)
	{
		if (page === 'home1')
			navBar.classList.remove('hidden');
		else
			navBar.classList.add('hidden');
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
		const response = await fetch('http://localhost:3000/profile', {
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
