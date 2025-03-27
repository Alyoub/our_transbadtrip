import { loadnhistory } from './app.js';

export function setupHostTournamentPage() {
	const images = ["../public/images/cover_1.jpeg", "../public/images/cover_2.jpeg", "../public/images/cover_3.png",
		"../public/images/cover_4.jpeg"];
	const coverImage = document.getElementById("coverImage") as HTMLElement;
	const coverImageInput = document.getElementById("coverImageInput") as HTMLInputElement;
	let currIndex = 0;
	const prevBtn = document.getElementById("prevBtn") as HTMLButtonElement;
	const nextBtn = document.getElementById("nextBtn") as HTMLButtonElement;
	const rtnProfilBtn = document.querySelector('.rtnProfilBtn') as HTMLButtonElement;

	setupTournamentForm();
	updateImage(currIndex, coverImage, coverImageInput, images);
	rtnProfilBtn?.addEventListener('click', () => loadnhistory('profil'));
	prevBtn?.addEventListener('click', () => {
		currIndex = (currIndex - 1 + images.length) % images.length;
		updateImage(currIndex, coverImage, coverImageInput, images);
	});
	nextBtn?.addEventListener('click', () => {
		currIndex = (currIndex + 1) % images.length;
		updateImage(currIndex, coverImage, coverImageInput, images);
	});
};

function	setupTournamentForm () {
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
		if (updateStartButton(input, submitBtn, inviteFriendsMode, invitedFriendsList, checkBoxes))
		{
			alert("Form submitted successfully! 🎉");
			//   form.submit();
		}
	});
};

function updateStartButton(input: HTMLInputElement, submitBtn: HTMLButtonElement, inviteFriendsMode: HTMLElement, invitedFriendsList: HTMLElement, checkBoxes: NodeListOf<HTMLInputElement>): boolean {
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

function updateImage(index: number, coverImage: HTMLElement, coverImageInput: HTMLInputElement, images: string[]) {
	coverImage.style.backgroundImage = `url('${images[index]}')`;
	coverImageInput.value = images[index];
};