require('dotenv').config();

const apiKey = process.env.RIOT_API_KEY;

const summonerNames = ['NombreInvocador1', 'NombreInvocador2', 'NombreInvocador3'];

async function getSummonerElo(name) {
    const response = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${apiKey}`);
    const summonerData = await response.json();

    const summonerId = summonerData.id;

    const rankedResponse = await fetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${apiKey}`);
    const rankedData = await rankedResponse.json();

    const soloQueueEntry = rankedData.find(entry => entry.queueType === 'RANKED_SOLO_5x5');

    return soloQueueEntry ? {
        tier: soloQueueEntry.tier,
        rank: soloQueueEntry.rank,
        lp: soloQueueEntry.leaguePoints
    } : null;
}

async function loadEloData() {
    const tableBody = document.querySelector('#eloTable tbody');

    const summonerDataArray = [];

    for (const summonerName of summonerNames) {
        const eloData = await getSummonerElo(summonerName);

        if (eloData) {
            summonerDataArray.push({ summonerName, elo: `${eloData.tier} ${eloData.rank}`, lp: eloData.lp });
        } else {
            summonerDataArray.push({ summonerName, elo: 'No clasificado', lp: 'N/A' });
        }
    }

    // Ordenar el array por Elo de manera ascendente
    summonerDataArray.sort((a, b) => {
        const eloOrder = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'];

        const eloA = eloOrder.indexOf(a.elo.split(' ')[0]);
        const eloB = eloOrder.indexOf(b.elo.split(' ')[0]);

        if (eloA < eloB) return -1;
        if (eloA > eloB) return 1;
        // En caso de empate en el tier, comparar por división (rank)
        return a.elo.localeCompare(b.elo);
    });

    for (const summonerData of summonerDataArray) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const eloCell = document.createElement('td');
        const lpCell = document.createElement('td');

        nameCell.textContent = summonerData.summonerName;
        eloCell.textContent = summonerData.elo;
        lpCell.textContent = summonerData.lp;

        row.appendChild(nameCell);
        row.appendChild(eloCell);
        row.appendChild(lpCell);

        tableBody.appendChild(row);
    }
}

loadEloData();