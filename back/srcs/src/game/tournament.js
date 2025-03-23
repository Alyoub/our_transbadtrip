
const {prisma} = require('../user/db')

async function createTournament(players) {
    const tournament = await prisma.tournament.create({
        data: {
            name: `Tournament ${new Date().toLocaleString()}`,
            players: {
                connect: players.map((id) => ({ id })),
            },
        },
    });
    return tournament;
}

async function updateMatchWinner(matchId, winnerId) {
    const match = await prisma.match.update({
        where: { id: matchId },
        data: { winnerId },
    });
    return match;
}

async function createMatch(tournamentId, player1Id, player2Id, round) {
    const match = await prisma.match.create({
        data: {
            tournamentId,
            player1Id,
            player2Id,
            round,
        },
    });
    return match;
}

class Tournament {
    constructor(players) {
        this.players = players; // Array of player IDs
        this.matches = []; // Array of matches
        this.currentRound = 1;
        this.winners = []; // Winners of each round
    }

    async createMatches() {
        this.matches = [];
        for (let i = 0; i < this.players.length; i += 2) {
            const match = await createMatch(
                this.tournamentId,
                this.players[i],
                this.players[i + 1],
                this.currentRound
            );
            this.matches.push(match);
        }
    }

    async advanceWinners(winnerIds) {
        this.winners = winnerIds;
        this.players = winnerIds; // Winners become players for the next round
        this.currentRound++;
        await this.createMatches(); // Create matches for the next round
    }

    isTournamentOver() {
        return this.winners.length === 1; // Only one winner remains
    }
}

module.exports = {Tournament,updateMatchWinner,createTournament,}
