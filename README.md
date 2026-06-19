# WorldCup Dashboard 2026 ⚽️🏆

A modern web application for managing and analyzing World Cup matches — designed for quick match entry, rich statistics, group standings, and local rule-based match predictions. Built with plain web technologies and LocalStorage for zero-config usage.

## Features ✨

### Match Management
- Add matches
- Delete matches
- Mark matches as favorite
- Mark matches as watched
- Search matches (live, case-insensitive)

### Statistics
- Total matches
- Favorite matches
- Watched matches

### Group Standings
- Wins
- Draws
- Losses
- Goals For
- Goals Against
- Goal Difference
- Points

### Tournament Statistics
- Average Goals Per Match
- Highest Scoring Match
- Most Favorite Team
- Most Watched Team
- Biggest Win

### AI Match Predictor 🤖
Predict the most likely winner between two teams using local, rule-based logic based on:
- Points
- Wins
- Goal Difference
- Goals Scored
- Match history

(No external or paid APIs required — predictions are deterministic and run client-side.)

## Technologies 🛠️
- HTML5
- CSS3
- JavaScript (vanilla)
- LocalStorage (browser)
- Git
- GitHub
- GitHub Copilot

## Project Architecture 🧭

Files:
- `index.html` — Main UI and layout
- `style.css` — Theme, layout and responsive styles
- `app.js` — App controller: UI wiring and interactions
- `matches.js` — Sample match data / match model helpers
- `storage.js` — LocalStorage persistence helpers
- `statistics.js` — All calculations: standings, tournament metrics, predictor logic

Folders:
- `agents/` — Agent guidance and task notes
- `skills/` — Reusable skill definitions for AI-assisted workflows

## AI-Assisted Development 🧠
Skills:
- `skills/worldcup-skill.md` — Domain knowledge and calculation patterns

Agents:
- `agents/frontend-agent.md` — Frontend enhancements & UI tasks
- `agents/storage-agent.md` — Persistence & data tasks
- `agents/statistics-agent.md` — Stats, standings and predictor logic

## Installation ⚡

1. Clone the repository:
```bash
git clone <repo-url>
```
2. Open `index.html` in your browser.
3. Enjoy — no server or build step required.

Tip: Use Chrome/Edge/Firefox for best LocalStorage and DevTools experience.

## Usage Tips 🧩
- Use the search box to filter matches by team name or group (case-insensitive).
- Favorites and watched flags persist via `localStorage`.
- Prediction results update immediately; add additional matches to improve prediction context.
- For reproducible testing, consider adding sample matches in `matches.js`.

## Future Improvements 🚀
- Charts and visualizations (goals, form, team comparisons)
- Export / import data (CSV, JSON)
- Per-team statistics and leaderboards page
- Head-to-head analytics and time-weighted predictions
- Add unique IDs to matches for robust editing and syncing
- Accessibility improvements (ARIA, keyboard navigation)

## Contributing 🤝
Contributions are welcome — open an issue or a pull request on GitHub. Keep changes minimal and focus on preserving existing features and data in `localStorage`.

## License 📄
Include your preferred license in the repo root (e.g., MIT) if you plan to share publicly.

—
Built for WorldCup enthusiasts and local analysis — lightweight, privacy-first, and easy to run.
