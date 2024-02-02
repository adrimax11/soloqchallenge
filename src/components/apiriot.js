import axios from 'axios';
const api = await import.meta.env.RIOT_API_KEY;

export async function getSummonerData(summonerName) {
    const url = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${api}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export async function getElo(summonerId) {
    const url = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${api}`;

    try {
        const response = await axios.get(url);
        const soloQueueEntry = response.data.find((entry) => entry.queueType === 'RANKED_SOLO_5x5');
        if (soloQueueEntry) {
            const wins = soloQueueEntry.wins;
            const losses = soloQueueEntry.losses;
            const partidas = wins + losses;
            const winrate = wins / partidas * 100;
            return {
                elo: `${soloQueueEntry.tier} ${soloQueueEntry.rank} (${soloQueueEntry.leaguePoints} LP)`,
                partidas,
                wins,
                losses,
                winrate,
            };
        } else {
            return {
                elo: 'Unranked',
                partidas: 0,
                wins: 0,
                losses: 0,
                winrate: 0,
            };
        }
    } catch (error) {
        console.error(error);
    }
}
