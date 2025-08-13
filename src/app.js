document.addEventListener('DOMContentLoaded', function() {
    const ticker = document.getElementById('ticker');
    const leagues = [
        { name: 'NFL', url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard' },
        { name: 'NBA', url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard' },
        { name: 'MLB', url: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard' },
        { name: 'NHL', url: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard' },
        { name: 'WNBA', url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard' }
    ];

    function startMarquee() {
        ticker.style.transition = 'none';
        ticker.style.transform = 'translateX(100%)';
        // Calculate duration based on ticker width and container width
        setTimeout(() => {
            const container = ticker.parentElement;
            const tickerWidth = ticker.offsetWidth;
            const containerWidth = container.offsetWidth;
            // Speed: 100px/sec, min 8s, max 30s
            let duration = Math.max(8000, Math.min(30000, ((tickerWidth + containerWidth) / 100) * 1000));
            ticker.style.transition = `transform ${duration}ms linear`;
            ticker.style.transform = `translateX(-${tickerWidth}px)`;
            // After animation ends, restart after 2 seconds
            setTimeout(() => {
                startMarquee();
            }, duration + 2000);
        }, 100);
    }

    async function fetchScores() {
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
                    const event = data.events[0];
                    if (event.competitions && event.competitions.length > 0) {
                        const comp = event.competitions[0];
                        const home = comp.competitors.find(c => c.homeAway === 'home');
                        const away = comp.competitors.find(c => c.homeAway === 'away');
                        let scoreText = `${league.name}: ${home.team.displayName} vs ${away.team.displayName} (${home.score || '-'} - ${away.score || '-'})`;
                        scores.push(scoreText);
                    } else {
                        scores.push(`${league.name}: No competitions`);
                    }
                } else {
                    scores.push(`${league.name}: No live events`);
                }
            } catch (e) {
                scores.push(`${league.name}: Error fetching scores`);
            }
        }
        ticker.textContent = scores.length > 0 ? scores.join(' | ') : 'No scores available.';
        startMarquee();
    }

    // Fetch scores and start marquee for the first time
    fetchScores();

    // Remove interval, instead fetch new scores each time marquee restarts
    // Modify startMarquee to fetch new scores before each scroll
    function startMarqueeWithUpdate() {
        fetchScores();
    }

    // Redefine startMarquee to call startMarqueeWithUpdate after each scroll
    function startMarquee() {
        ticker.style.transition = 'none';
        ticker.style.transform = 'translateX(100%)';
        setTimeout(() => {
            const container = ticker.parentElement;
            const tickerWidth = ticker.offsetWidth;
            const containerWidth = container.offsetWidth;
            let duration = Math.max(8000, Math.min(30000, ((tickerWidth + containerWidth) / 100) * 1000));
            ticker.style.transition = `transform ${duration}ms linear`;
            ticker.style.transform = `translateX(-${tickerWidth}px)`;
            setTimeout(() => {
                setTimeout(startMarqueeWithUpdate, 2000);
            }, duration);
        }, 100);
    }
});