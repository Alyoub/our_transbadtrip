export class notificationHeader extends HTMLElement {
	constructor() {
		super();
		this.innerHTML =
		`<header class="header_notif max-635:px-14 px-24 lg:px-32 z-10">
			<button data-page="home" title="Home" class="home-btn logo_notif transition-transform duration-300 hover:scale-110">
				<img class="logo-pic_notif" src="../public/logos/pingpong_racket.png">
				<div class="logo-name_notif">
					<p class="logo-name1_notif">
						PingPong.io
					</p>
					<p class="hero_notif">
						Table Heroes
					</p>
				</div>
			</button data-page="home" title="Home">
			<div class="center_notif">
			</div>
			<div class="sign-bt_notif">
				<button id="notifsBtn" class="log-in-bt1_notif">
					<img class="user_header_pic" src="../public/profile_pictures/htouil.jpeg">
					<p class="user_name_header">
						htouil
					</p>
					<img class="user_notification_header" src="../public/logos/bell.svg">
				</button>
			</div>
		</header>`;
	};
};

export class simpleHeader extends HTMLElement {
	constructor() {
		super();
		this.innerHTML =
		`<header class="header_notif max-635:px-14 px-24 lg:px-32">
			<button data-page="home" title="Home" class="home-btn logo_notif transition-transform duration-300 hover:scale-110">
				<img class="logo-pic_notif" src="../public/logos/pingpong_racket.png">
				<div class="logo-name_notif">
					<p class="logo-name1_notif">
						PingPong.io
					</p>
					<p class="hero_notif">
						Table Heroes
					</p>
				</div>
			</button data-page="home" title="Home">
			<div class="center_notif">
			</div>
		</header>`;
	};
};

export class newFriendRequestTag extends HTMLElement {
	constructor() {
		super();
	};
	connectedCallback() {
		this.innerHTML =
		`<div class="grid grid-cols-3 grid-rows-1 border rounded-xl md:h-12 xl:h-14 2xl:h-16 max-814:pl-1.5 pl-2 max-814:pr-1.5 pr-4" style="background: #3f4251;">
			<div class="col-span-2 flex items-center max-814:gap-1 gap-2">
				<img src="../public/profile_pictures/htouil.jpeg" alt="htouil" class="rounded-full size-8 xl:size-9 2xl:size-10">
				<div class="flex flex-col justify-items-center py-1">
					<strong class="md:text-xs lg:text-sm xl:text-base">htouil</strong>
					<span class="md:text-3xs lg:text-2xs">Requested 3 days ago</span>
				</div>
			</div>
			<div class="self-center justify-self-end grid grid-cols-2 md:gap-1 2xl:gap-3 size-fit">
				<button type="button" class="grid place-items-center border border-black rounded-lg md:w-7 2xl:w-9 2xl:h-4 accRejBtn">
					<svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="size-3">
						<path clip-rule="evenodd" fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z">
						</path>
					</svg>
				</button>
				<button type="button" class="grid place-items-center border border-black rounded-lg md:w-7 2xl:w-9 2xl:h-4 accRejBtn">
					<svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="size-3">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>
		</div>`;
	};
};

export class oldFriendTag extends HTMLElement {
	constructor() {
		super();
	};
	connectedCallback() {
		this.innerHTML =
		`<div class="grid grid-cols-3 grid-rows-1 border rounded-xl md:h-12 xl:h-14 2xl:h-16 px-2"
			style="background: #3f4251;">
			<div class="col-span-2 flex items-center max-814:gap-1 gap-2">
				<img src="../public/profile_pictures/htouil.jpeg" alt="htouil"
					class="rounded-full size-8 xl:size-9 2xl:size-10">
				<div class="flex flex-col justify-items-center py-1">
					<strong class="md:text-xs lg:text-sm xl:text-base">htouil</strong>
					<span class="md:text-3xs lg:text-2xs">Level 7</span>
				</div>
			</div>
		</div>`;
	};
};

export class matchScoreTag extends HTMLElement {
	constructor() {
		super();
	};
	connectedCallback() {
		// const lossColor = '#8a3f47';
		// const winColor = '#3f6f92';
		// const drawColor = '#60609b';
		const stateColor = this.getAttribute('state-color');

		this.innerHTML =
		`<div class="grid grid-cols-3 grid-rows-1 border items-center rounded-xl h-14 px-2 py-1" style="background-color: ${stateColor};">
			<div class="grid grid-cols-2 grid-rows-1 md:gap-2 lg:gap-0">
				<img src="../public/profile_pictures/htouil.jpeg" alt="htouil" class="justify-self-start rounded-full size-8 lg:size-9 xl:size-10">
				<p class="justify-self-start self-center text-lg">1</p>
			</div>
			<p class="place-self-center">VS</p>
			<div class="grid grid-cols-2 grid-rows-1 md:gap-2 lg:gap-0">
				<p class="justify-self-end self-center text-lg">3</p>
				<img src="../public/profile_pictures/htouil.jpeg" alt="htouil" class="justify-self-end rounded-full size-8 lg:size-9 xl:size-10">
			</div>
		</div>`;
	};
};

export class sideNewFriendRequestTag extends HTMLElement {
	constructor() {
		super();
	};
	connectedCallback() {
		this.innerHTML =
		`<div class="grid grid-cols-3 grid-rows-1 border rounded-xl h-11 pl-2 max-527:pr-2 pr-4" style="background: #3f4251;">
			<div class="col-span-2 flex items-center gap-2">
				<img src="../public/profile_pictures/htouil.jpeg" alt="htouil" class="rounded-full size-8">
				<div class="flex flex-col justify-items-center py-1">
					<strong class="max-503:text-2xs text-xs">htouil</strong>
					<span class="max-503:text-4xs text-3xs">Requested 3 days ago</span>
				</div>
			</div>
			<div class="self-center justify-self-end grid grid-cols-2 gap-1 size-fit">
				<button type="button" class="grid place-items-center border border-black rounded-lg w-7 accRejBtn">
					<svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="size-3">
						<path clip-rule="evenodd" fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"></path>
					</svg>
				</button>
				<button type="button" class="grid place-items-center border border-black rounded-lg w-7 accRejBtn">
					<svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="size-3">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>
		</div>`;
	};
};

export class sideOldFriendTag extends HTMLElement {
	constructor() {
		super();
	};
	connectedCallback() {
		this.innerHTML =
		`<div class="grid grid-cols-3 grid-rows-1 border rounded-xl h-11 px-2" style="background: #3f4251;">
			<div class="col-span-2 flex items-center gap-2">
				<img src="../public/profile_pictures/htouil.jpeg" alt="htouil" class="rounded-full size-8">
				<div class="flex flex-col justify-items-center py-1">
					<strong class="max-503:text-2xs text-xs">htouil</strong>
					<span class="max-503:text-4xs text-3xs">Requested 3 days ago</span>
				</div>
			</div>
		</div>`;
	};
};

export class sideMatchScoreTag extends HTMLElement {
	constructor() {
		super();
	};
	connectedCallback() {
		// const lossColor = '#8a3f47';
		// const winColor = '#3f6f92';
		// const drawColor = '#60609b';
		const stateColor = this.getAttribute('state-color');

		this.innerHTML =
		`<div class="grid grid-cols-3 grid-rows-1 border items-center rounded-xl h-12 px-2 py-1" style="background-color: ${stateColor};">
			<div class="grid grid-cols-2 grid-rows-1">
				<img src="../public/profile_pictures/htouil.jpeg" alt="htouil" class="justify-self-start rounded-full size-8">
				<p class="justify-self-center sm:justify-self-start self-center text-lg">1</p>
			</div>
			<p class="place-self-center">VS</p>
			<div class="grid grid-cols-2 grid-rows-1">
				<p class="justify-self-center sm:justify-self-end self-center text-lg">3</p>
				<img src="../public/profile_pictures/htouil.jpeg" alt="htouil" class="justify-self-end rounded-full size-8">
			</div>
		</div>`;
	};
};

export class friendToTournamentTag extends HTMLElement {
	constructor() {
		super();
	};
	connectedCallback() {
		this.innerHTML =
		`<label class="grid grid-cols-3 grid-rows-1 border rounded-xl max-550:h-10 xs:h-11 sm:h-12 md:h-14 lg:h-14 2xl:h-16 pl-2 pr-4" style="background: #3f4251;">
			<div class="col-span-2 flex items-center gap-2">
				<img src="../public/profile_pictures/htouil.jpeg" alt="htouil" class="rounded-full xs:size-8 sm:size-9 md:size-10 2xl:size-12">
				<div class="flex flex-col justify-items-center py-1">
					<strong class="max-550 max-595:text-2xs xs:text-xs sm:text-xs md:text-sm lg:text-sm 2xl:text-base">Hatim Touil</strong>
					<span class="max-595:text-3xs xs:text-2xs sm:text-2xs md:text-xs lg:text-xs 2xl:text-sm">Level 7</span>
				</div>
			</div>
			<input type="checkbox" name="InvitedList" class="peer hidden">
			<span class="self-center justify-self-end relative max-550:size-4 xs:size-5 sm:size-6 lg:size-7 2xl:size-8 flex justify-center items-center bg-gray-600 border-4 border-gray-100 rounded-full shadow-md transition-all duration-300 peer-checked:bg-blue-400/70 peer-hover:scale-105">
				<span class="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 opacity-0 peer-checked:opacity-100 rounded-full transition-all duration-300 peer-checked:animate-pulse"></span>
				<svg fill="currentColor" viewBox="0 0 20 20" class="hidden text-white peer-checked:block transition-transform duration-300 transform scale-50 peer-checked:scale-100" xmlns="http://www.w3.org/2000/svg">
					<path clip-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" fill-rule="evenodd"></path>
				</svg>
			</span>
		</label>`;
	};
};
