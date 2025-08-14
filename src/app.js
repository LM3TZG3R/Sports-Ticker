document.addEventListener('DOMContentLoaded', function() {
    const ticker = document.getElementById('ticker');
    const leagues = [
        { name: 'NFL', url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard' },
        { name: 'NBA', url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard' },
        { name: 'MLB', url: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard' }
    ];

    async function fetchScoresAndScroll() {
        let scores = [];
        for (const league of leagues) {
            try {
                const res = await fetch(league.url);
                if (!res.ok) {
                    scores.push(`${league.name}: Error (${res.status})`);
                    continue;
                }
                const data = await res.json();
                if (data.events && data.events.length > 0) {
                    let foundLive = false;
                    for (const event of data.events) {
                        if (event.competitions && event.competitions.length > 0) {
                            const comp = event.competitions[0];
                            const home = comp.competitors.find(c => c.homeAway === 'home');
                            const away = comp.competitors.find(c => c.homeAway === 'away');
                            // Status: scheduled, in progress, final
                            const status = comp.status?.type?.description || 'Unknown';
                            // Timestamp (if available)
                            const time = comp.status?.type?.shortDetail || '';
                            let scoreText = `${league.name}: ${home.team.displayName} vs ${away.team.displayName} (${home.score || '-'} - ${away.score || '-'}) [${status}${time ? ' - ' + time : ''}]`;
                            // Only show live/in progress events, but if none, show all
                            if (status.toLowerCase().includes('in progress')) {
                                scores.push(scoreText);
                                foundLive = true;
                            } else if (!foundLive) {
                                scores.push(scoreText);
                            }
                        }
                    }
                } else {
                    scores.push(`${league.name}: No events`);
                }
            } catch (e) {
                scores.push(`${league.name}: Error fetching scores`);
            }
        }
        ticker.textContent = scores.length > 0 ? scores.join(' | ') : 'No scores available.';
        setTimeout(() => {
            scrollTicker();
        }, 100);
    }

    function scrollTicker() {
        ticker.style.transition = 'none';
        ticker.style.transform = 'translateX(100%)';
        setTimeout(() => {
            const container = ticker.parentElement;
            const tickerWidth = ticker.offsetWidth;
            const containerWidth = container.offsetWidth;
            let distance = tickerWidth + containerWidth;
            // Slow down: set min 60s, max 120s
            let duration = Math.max(60000, Math.min(120000, (distance / 60) * 1000));
            ticker.style.transition = `transform ${duration}ms linear`;
            ticker.style.transform = `translateX(-${tickerWidth}px)`;
            setTimeout(() => {
                setTimeout(fetchScoresAndScroll, 2000);
            }, duration);
        }, 100);
    }

    fetchScoresAndScroll();
});