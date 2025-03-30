import { loadnhistory } from './app.js';

export function setupTournamentPage(){
    const startTournamentBtn = document.getElementById('startTournamentBtn') as HTMLButtonElement;
    const rtnProfilBtn = document.getElementById('rtnProfilBtn') as HTMLButtonElement;

    startTournamentBtn?.addEventListener('click', () => loadnhistory('tournament'));
    rtnProfilBtn?.addEventListener('click', () => loadnhistory('profil'));
    
};

export function extractPlayersNames():string[] {
    // const player1 = (document.getElementById('player1') as HTMLInputElement)?.value || 'Player 1';
    const tournamentPlayers: string[] = [
        (document.getElementById('player1') as HTMLInputElement)?.value || 'Player 1',
        (document.getElementById('player2') as HTMLInputElement)?.value || 'Player 2',
        (document.getElementById('player3') as HTMLInputElement)?.value || 'Player 3',
        (document.getElementById('player4') as HTMLInputElement)?.value || 'Player 4',
    ];

    const ps = document.getElementById('player1') as HTMLInputElement;


    // console.log(ps.value);

    return (tournamentPlayers);
};
// let tournamentPlayers: string[] = [];