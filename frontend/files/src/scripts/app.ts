// import { setupLoginPage } from "./login.js";
import { updateHomeHeadermain3 } from "./home1.js";
import { updateHomeHeadermain5, setupLoginPage } from "./home2.js";
import { updateSettingsPage } from "./settings.js";
import { rakmanchat } from "./chat.js";

// home page:
let app: HTMLElement;
let navBar: HTMLElement | null;
let navBtns: NodeListOf<HTMLElement> | null;
//profil page:
let homeBtn: HTMLElement | null;
let settingsBtn: HTMLElement | null;
let addFriendBtn: HTMLElement | null;
let msgBtn: HTMLElement | null;
let sidePanel: HTMLElement | null;
let openBtn: HTMLElement | null;
let closeBtn: HTMLElement | null;
let friendsBtn: NodeListOf<Element> | null;
let historyBtn: NodeListOf<Element> | null;
let friendsList: NodeListOf<Element> | null;
let historyList: NodeListOf<Element> | null;
let localBtn: HTMLElement | null;
let onlineBtn: HTMLElement | null;
let hostTournBtn: HTMLElement | null;
//messages page:
let returnBtn: HTMLElement | null;
//host tournament page:

document.addEventListener('DOMContentLoaded', () => {
	app = document.getElementById('app')!;
	navBar = document.querySelector('nav');
	navBtns = document.querySelectorAll('.nav-btn');

	const urlParams = new URLSearchParams(window.location.search);
    const initialPage = urlParams.get('page') || 'home';

	// console.log(`here:`);
	history.replaceState({ page: initialPage }, '', `?page=${initialPage}`);
	loadPage(initialPage);
	navBtns.forEach((button: HTMLElement) =>
	{
		button.addEventListener('click', () =>
		{
			const page = button.dataset.page!;
			loadPage(page);
			history.pushState({ page }, '', `?page=${page}`);
		});
	});
	window.onpopstate = (event: PopStateEvent) => {
		// console.log(`load: ${event.state?.page}`);
		if (event.state?.page) {
			loadPage(event.state.page);
		}
	};
});

export const loadPage = async (page: string) => {
	try {
		const response = await fetch(`pages/${page}.html`);
		const content = await response.text();
		app.innerHTML = content;
		// console.log(`nav to: ${page}`);
		hideNav(page);
		if (page === 'home')
		{
			setupHomePage();
		}
		// if (page === 'login')
		// {
		// 	setupLoginPage();
		// }
		if (page === 'profil')
		{
			setupProfilButtons();
			handleScroll();
		}
		if (page === 'messages')
		{
			// setupMessagesButtons();
			rakmanchat();
		}
		if (page === 'hosttourn')
		{
			setupHostTournamentPage();
		}
		if (page === 'settings')
		{
			updateSettingsPage();
		}
		
	}
	catch (error)
	{
		app.innerHTML = `<p class="text-red-500">Page not found.</p>`;
	}
};

export const hideNav = (page: string) =>
{
	if (navBar)
	{
		if (page === 'home1')
			navBar.classList.remove('hidden');
		else
			navBar.classList.add('hidden');
	}
};

export const loadnhistory = (toLoad: string) => {
	loadPage(toLoad);
	history.pushState({ page: toLoad }, '', `?page=${toLoad}`);
};

//Home page:
const setupHomePage = () => {
	updateHomeHeadermain3();
	updateHomeHeadermain5();
	setupLoginPage();
};

//Profil page:
const setupProfilButtons = () => {
	homeBtn = document.querySelector('.home-btn');
	settingsBtn = document.querySelector('.settings-btn');
	addFriendBtn = document.getElementById('addFriendBtn');
	msgBtn = document.getElementById('msgBtn');
	sidePanel = document.getElementById('friends-panel');
	openBtn = document.getElementById('open-btn');
	closeBtn = document.getElementById('close-btn');
	friendsBtn = document.querySelectorAll('.friends-btn');
	historyBtn = document.querySelectorAll('.history-btn');
	friendsList = document.querySelectorAll('.friends-list');
	historyList = document.querySelectorAll('.history-list');
	localBtn = document.getElementById('local-btn');
	onlineBtn = document.getElementById('online-btn');
	hostTournBtn = document.querySelector('.host-tourn-btn');
	
	homeBtn?.addEventListener('click', () => loadnhistory('home'));
	settingsBtn?.addEventListener('click', () => loadnhistory('settings'));
	addFriendBtn?.addEventListener('click', showAddFriendPopup);
	msgBtn?.addEventListener('click', () => loadnhistory('messages'));
	openBtn?.addEventListener('click', openSidePanel);
	closeBtn?.addEventListener('click', closeSidePanel);
	document.addEventListener('click', handleOutsideClick);
	friendsBtn?.forEach((element) => {
		element.addEventListener('click', showFriendsList);
	});
	historyBtn?.forEach((element) => {
		element.addEventListener('click', showHistoryList);
	});
	localBtn?.addEventListener('click', selectLocal);
	onlineBtn?.addEventListener('click', selectOnline);
	hostTournBtn?.addEventListener('click', () => loadnhistory('hosttourn'));
};

const showAddFriendPopup = () => {
	const toBlur = document.getElementById('toBlur') as HTMLElement;
	const toPop = document.getElementById('toPop') as HTMLElement;
	const bud = document.getElementById('body') as HTMLElement;

	bud?.classList.add('overflow-hidden');
	toBlur.inert = true;
	toBlur.classList.add('blur-md');
	// toBlur.classList.add('overscroll-none');
	toPop.classList.remove('hidden');
	toPop.classList.add('flex');
};

const selectLocal = () => {
	localBtn?.classList.add('bg-gray-600');
	onlineBtn?.classList.remove('bg-gray-600', 'hover:bg-gray-500');
};

const selectOnline = () => {
	onlineBtn?.classList.add('bg-gray-600');
	localBtn?.classList.remove('bg-gray-600', 'hover:bg-gray-500');
};

const openSidePanel = (e: Event) => {
	e?.stopPropagation();
	sidePanel?.classList.remove('translate-x-full');
	document.body.classList.add('overflow-hidden');
	showFriendsList();
};

const closeSidePanel = (e?: Event) => {
	e?.stopPropagation();
	sidePanel?.classList.add('translate-x-full');
	document.body.classList.remove('overflow-hidden');
};

const handleOutsideClick = (e: Event) => {
	if (sidePanel && !sidePanel.contains(e.target as Node) && e.target !== openBtn)
		closeSidePanel();
};

const showFriendsList = () => {
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

const showHistoryList = () => {
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

const handleScroll = () => {
	let scrollables = document.querySelectorAll('.scrollable');
	
	scrollables?.forEach((element) => {
		let timeout: NodeJS.Timeout = setTimeout(() => {}, 0);
		
		element.addEventListener('scroll', () => showScrollbar(element as HTMLElement, timeout));
		hideScrollbar(element as HTMLElement);
	});
};

const showScrollbar = (element: HTMLElement, timeout: NodeJS.Timeout) => {
	element.classList.remove('scrollbar-none');
	clearTimeout(timeout);
	timeout = setTimeout(() => hideScrollbar(element), 1500);
};

const hideScrollbar = (element: HTMLElement) => {
	element.classList.add('scrollbar-none');
};

//Messages page:
const setupMessagesButtons = () => {
	returnBtn = document.querySelector('.rtn-profil-btn');
	
	returnBtn?.addEventListener('click', () => loadnhistory('profil'));
};

//Host Tournament page:
const setupHostTournamentPage = () => {

	const images = ["../public/images/cover_1.jpeg", "../public/images/cover_2.jpeg", "../public/images/cover_3.png",
		"../public/images/cover_4.jpeg"];
	const coverImage = document.getElementById("coverImage") as HTMLElement;
	const coverImageInput = document.getElementById("coverImageInput") as HTMLInputElement;
	let currIndex = 0;
	const prevBtn = document.getElementById("prevBtn") as HTMLButtonElement;
	const nextBtn = document.getElementById("nextBtn") as HTMLButtonElement;

	returnBtn = document.querySelector('.rtn-profil-btn');
	returnBtn?.addEventListener('click', () => loadnhistory('profil'));

	setupTournamentForm();
	updateImage(currIndex, coverImage, coverImageInput, images);
	// console.log(`here: ${coverImageInput.value}`);
	prevBtn?.addEventListener('click', () => {
		currIndex = (currIndex - 1 + images.length) % images.length;
		updateImage(currIndex, coverImage, coverImageInput, images);
	});
	nextBtn?.addEventListener('click', () => {
		currIndex = (currIndex + 1) % images.length;
		updateImage(currIndex, coverImage, coverImageInput, images);
	});
};

const	setupTournamentForm = () => {
	const form = document.getElementById('tournamentForm') as HTMLFormElement;
	const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
	const input = form.querySelector('input[required]') as HTMLInputElement;
	const inviteFriendsMode = document.getElementById('inviteFriendsMode') as HTMLElement;
	const invitedFriendsList = document.getElementById('invitedFriendsList') as HTMLElement;
	const checkBoxes = form.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

	if (!submitBtn || !inviteFriendsMode || !form) return;
	form.addEventListener("input", () => updateStartButton(input, submitBtn, inviteFriendsMode, invitedFriendsList, checkBoxes));
	form.addEventListener("submit", (event: Event) => {
		event.preventDefault();
		if (updateStartButton(input, submitBtn, inviteFriendsMode, invitedFriendsList, checkBoxes)) {
			alert("Form submitted successfully! 🎉");
			//   form.submit();
		}
	});
};

const updateStartButton = (input: HTMLInputElement, submitBtn: HTMLButtonElement, inviteFriendsMode: HTMLElement, invitedFriendsList: HTMLElement, checkBoxes: NodeListOf<HTMLInputElement>): boolean => {
	let allValid = true;
	const txtErrMsg = document.createElement('p');
	const boxErrMsg = document.createElement('p');

	txtErrMsg.className = 'max-550:mt-1 mt-2 text-red-500 max-550:text-3xs xs:text-3xs sm:text-2xs text-xs lg:text-xs 2xl:text-sm';
	txtErrMsg.textContent = 'Please provide a name for the tournament.';
	boxErrMsg.className = 'max-550:mt-1 mt-2 text-red-500 max-550:text-3xs xs:text-3xs sm:text-2xs text-xs lg:text-xs 2xl:text-sm';
	boxErrMsg.textContent = 'Please select at least 3 players.';

	submitBtn.style.backgroundColor = "#8a8a92";
	if (!input.value.trim())
	{
		allValid = false;
		input.classList.add('ring', 'ring-red-500');
		if (!input.nextElementSibling?.classList.contains('text-red-500'))
			input.after(txtErrMsg);
		// console.log(`here: '${input.value}'`);
	}
	else
	{
		input.classList.remove('ring', 'ring-red-500');
		if (input.nextElementSibling?.classList.contains('text-red-500'))
			input.nextElementSibling.remove();
	}
	const checkedCount = Array.from(checkBoxes).filter(checkbox => checkbox.checked).length;
	// console.log(`total: `);
    if (checkedCount < 3)
		{
        allValid = false;
		inviteFriendsMode.style.setProperty('border-color', '#ef4444');
		if (!invitedFriendsList.nextElementSibling?.classList.contains('text-red-500'))
			invitedFriendsList.after(boxErrMsg);
	}
	else
	{
		inviteFriendsMode.style.setProperty('border-color', '#5487a8');
		if (invitedFriendsList.nextElementSibling?.classList.contains('text-red-500'))
			invitedFriendsList.nextElementSibling.remove();
	}
	submitBtn.style.setProperty('background-color', allValid ? '#4b7694' : '#8a8a92');
	return (allValid);
};

const updateImage = (index: number, coverImage: HTMLElement, coverImageInput: HTMLInputElement, images: string[]) => {
	coverImage.style.backgroundImage = `url('${images[index]}')`;
	coverImageInput.value = images[index];
};

//////////////////////////////////////////////////////////////
// figure out how to link .js files together in app.ts
// import * as home1 from "./home1";
// import * as home2 from "./home2";
// import * as login from "./login";
// import * as profile from "./TS/Profile_ts/profile";
// import { updateHomeHeadermain3 } from "./home1";
// import { updateHomeHeadermain5 } from "./home2";

//Settings page:
const setupSettingsButtons = () => {
	returnBtn = document.querySelector('.rtn-profil-btn');
	
	returnBtn?.addEventListener('click', () => loadnhistory('profil'));
};

// //Signup page:
// const setupLoginPage = () => {
	
// };
