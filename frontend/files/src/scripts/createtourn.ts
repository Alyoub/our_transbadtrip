import { loadnhistory } from './app.js';

export function startTournament() {
    const startTournamentBtn = document.getElementById('startTournamentBtn');

    startTournamentBtn?.addEventListener('click', () => loadnhistory('tournament'));
};