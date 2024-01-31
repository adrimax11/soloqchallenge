import axios from 'axios';
import fs from 'fs/promises';

async function getElo(summonerName) {
    const response = await axios.get(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerName}`, {
        headers: {
            "X-Riot-Token": "api"
        }
    });

    const elo = response.data[0].tier + " (" + response.data[0].leaguePoints + " LP)";

    return elo;
}

async function updateElo() {
    const data = await fs.readFile('jugadores.json', 'utf-8');
    const jugadores = JSON.parse(data);

    for (let jugador of jugadores) {
        const elo = await getElo(jugador.cuenta);
        jugador.elo = elo;
    }

    await fs.writeFile('jugadores.json', JSON.stringify(jugadores, null, 2));
}

updateElo().catch(console.error);