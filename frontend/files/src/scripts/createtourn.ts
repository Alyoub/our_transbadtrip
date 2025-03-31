import { loadnhistory , fetchPlayerData } from './app.js';

export async function	setupCreateTournamentPage() {
	try
	{
		const playerData = await fetchPlayerData();
		// const iPlayerName = document.getElementById('iPlayerName') as HTMLSpanElement;
		const iPlayerUsername = document.getElementById('iPlayerUsername') as HTMLSpanElement;

		// if (iPlayerName)
		// 	iPlayerName.textContent = playerData.name;
		if (iPlayerUsername)
			iPlayerUsername.textContent = playerData.login;
	}
	catch(error)
	{
		// console.error("Failed to update the Player's name: ", error);
	}
};


export let tournamentPlayers: string[] = [];

export function setupCreateTournamentButtons(){
    const rtnProfilBtn = document.getElementById('rtnProfilBtn') as HTMLButtonElement;

    rtnProfilBtn?.addEventListener('click', () => loadnhistory('profil'));
    extractPlayersNames();
};

function extractPlayersNames() {
    const form = document.getElementById('tournamentForm') as HTMLFormElement;
    const player1 = document.getElementById('player1') as HTMLInputElement;
    const player2 = document.getElementById('player2') as HTMLInputElement;
    const player3 = document.getElementById('player3') as HTMLInputElement;
    const player4 = document.getElementById('player4') as HTMLInputElement;

    tournamentPlayers = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
    form?.addEventListener('input', () => {
        tournamentPlayers = [
            player1?.value || 'Player 1',
            player2?.value || 'Player 2',
            player3?.value || 'Player 3',
            player4?.value || 'Player 4',
        ];
    });
    form?.addEventListener('submit', (event: Event) => {
        event.preventDefault();
        loadnhistory('tournament');
    });
};
