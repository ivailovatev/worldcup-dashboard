/**
 * World Cup Dashboard 2026 - Main Application
 * Manages the complete dashboard functionality including matches, storage, and statistics
 */

// Global state
let matches = [];

// DOM Elements
const matchForm = document.getElementById('match-form');
const homeTeamInput = document.getElementById('home-team');
const awayTeamInput = document.getElementById('away-team');
const groupInput = document.getElementById('group');
const dateInput = document.getElementById('date');
const scoreInput = document.getElementById('score');
const matchesContainer = document.getElementById('matches-container');
const searchInput = document.getElementById('search-input');
const totalMatchesElement = document.getElementById('total-matches');
const watchedMatchesElement = document.getElementById('watched-matches');
const favoriteMatchesElement = document.getElementById('favorite-matches');
const standingsContainer = document.getElementById('standings-container');
const tournamentStatsContainer = document.getElementById('tournament-stats-container');
const predictTeamAInput = document.getElementById('predict-team-a');
const predictTeamBInput = document.getElementById('predict-team-b');
const predictButton = document.getElementById('predict-button');
const predictionResult = document.getElementById('prediction-result');

/**
 * Formats a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
}

/**
 * Renders group standings tables
 * Displays all groups with team statistics sorted by points
 */
function renderGroupStandings() {
    try {
        if (!standingsContainer) {
            console.error('Standings container not found');
            return;
        }

        // Calculate standings
        const standings = calculateGroupStandings(matches);
        const groups = Object.keys(standings).sort();

        // Clear existing content
        standingsContainer.innerHTML = '';

        // Handle empty state
        if (groups.length === 0) {
            standingsContainer.innerHTML = '<div class="empty-state"><p>No matches yet. Add matches to see group standings!</p></div>';
            return;
        }

        // Create table for each group
        groups.forEach(group => {
            const teamsList = standings[group];

            // Create group container
            const groupDiv = document.createElement('div');
            groupDiv.className = 'group-standings';

            // Create group title
            const groupTitle = document.createElement('h3');
            groupTitle.className = 'group-title';
            groupTitle.textContent = `GROUP ${group}`;
            groupDiv.appendChild(groupTitle);

            // Create table
            const table = document.createElement('table');
            table.className = 'standings-table';

            // Create table header
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th class="col-team">Team</th>
                    <th class="col-number">P</th>
                    <th class="col-number">W</th>
                    <th class="col-number">D</th>
                    <th class="col-number">L</th>
                    <th class="col-number">GF</th>
                    <th class="col-number">GA</th>
                    <th class="col-number">GD</th>
                    <th class="col-number">Pts</th>
                </tr>
            `;
            table.appendChild(thead);

            // Create table body
            const tbody = document.createElement('tbody');
            teamsList.forEach((team, index) => {
                const row = document.createElement('tr');
                row.className = index === 0 ? 'first-place' : '';
                
                row.innerHTML = `
                    <td class="col-team">${team.team}</td>
                    <td class="col-number">${team.played}</td>
                    <td class="col-number">${team.wins}</td>
                    <td class="col-number">${team.draws}</td>
                    <td class="col-number">${team.losses}</td>
                    <td class="col-number">${team.goalsFor}</td>
                    <td class="col-number">${team.goalsAgainst}</td>
                    <td class="col-number">${team.goalDifference > 0 ? '+' : ''}${team.goalDifference}</td>
                    <td class="col-number points-col">${team.points}</td>
                `;
                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            groupDiv.appendChild(table);
            standingsContainer.appendChild(groupDiv);
        });

        console.log(`✓ Group standings rendered for ${groups.length} groups`);
    } catch (error) {
        console.error('Error rendering group standings:', error);
    }
}

/**
 * Renders tournament statistics cards
 * Displays aggregate statistics about the tournament
 */
function renderTournamentStatistics() {
    try {
        if (!tournamentStatsContainer) {
            console.error('Tournament stats container not found');
            return;
        }

        // Clear existing content
        tournamentStatsContainer.innerHTML = '';

        // Handle empty state
        if (matches.length === 0) {
            tournamentStatsContainer.innerHTML = '<div class="empty-state"><p>No matches yet. Add matches to see tournament statistics!</p></div>';
            return;
        }

        // Calculate statistics
        const avgGoals = calculateAverageGoalsPerMatch(matches);
        const highestScoringMatch = findHighestScoringMatch(matches);
        const mostFavoriteTeam = findMostFavoriteTeam(matches);
        const mostWatchedTeam = findMostWatchedTeam(matches);
        const biggestWin = findBiggestWin(matches);

        // Create stats grid
        const statsGrid = document.createElement('div');
        statsGrid.className = 'stats-grid';

        // Average Goals Per Match Card
        const avgGoalsCard = createStatCard(
            'Average Goals Per Match',
            avgGoals.toFixed(2),
            '⚽'
        );
        statsGrid.appendChild(avgGoalsCard);

        // Highest Scoring Match Card
        let highestScoringContent = 'No matches';
        if (highestScoringMatch) {
            const matchDate = new Date(highestScoringMatch.match.date);
            const dateStr = matchDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: '2-digit'
            });
            highestScoringContent = `
                <div class="stat-match-info">
                    <div class="match-detail">${highestScoringMatch.match.homeTeam} ${highestScoringMatch.match.score} ${highestScoringMatch.match.awayTeam}</div>
                    <div class="match-meta">${highestScoringMatch.totalGoals} total goals • ${dateStr}</div>
                </div>
            `;
        }
        const highestScoringCard = document.createElement('div');
        highestScoringCard.className = 'tournament-stat-card';
        highestScoringCard.innerHTML = `
            <div class="stat-icon">🔥</div>
            <div class="stat-title">Highest Scoring Match</div>
            <div class="stat-value-large">${highestScoringContent}</div>
        `;
        statsGrid.appendChild(highestScoringCard);

        // Most Favorite Team Card
        const mostFavoriteCard = createStatCard(
            'Most Favorite Team',
            mostFavoriteTeam,
            '⭐'
        );
        statsGrid.appendChild(mostFavoriteCard);

        // Most Watched Team Card
        const mostWatchedCard = createStatCard(
            'Most Watched Team',
            mostWatchedTeam,
            '👁️'
        );
        statsGrid.appendChild(mostWatchedCard);

        // Biggest Win Card
        let biggestWinContent = 'No matches';
        if (biggestWin) {
            const { homeGoals, awayGoals } = parseScore(biggestWin.match.score);
            const winner = homeGoals > awayGoals ? biggestWin.match.homeTeam : biggestWin.match.awayTeam;
            biggestWinContent = `
                <div class="stat-match-info">
                    <div class="match-detail">${biggestWin.match.homeTeam} ${biggestWin.match.score} ${biggestWin.match.awayTeam}</div>
                    <div class="match-meta">${winner} won by ${biggestWin.goalDifference}</div>
                </div>
            `;
        }
        const biggestWinCard = document.createElement('div');
        biggestWinCard.className = 'tournament-stat-card';
        biggestWinCard.innerHTML = `
            <div class="stat-icon">🏆</div>
            <div class="stat-title">Biggest Win</div>
            <div class="stat-value-large">${biggestWinContent}</div>
        `;
        statsGrid.appendChild(biggestWinCard);

        tournamentStatsContainer.appendChild(statsGrid);

        console.log('✓ Tournament statistics rendered');
    } catch (error) {
        console.error('Error rendering tournament statistics:', error);
    }
}

/**
 * Handles predict button click
 */
function handlePredict() {
    try {
        const teamA = predictTeamAInput ? predictTeamAInput.value.trim() : '';
        const teamB = predictTeamBInput ? predictTeamBInput.value.trim() : '';

        if (!predictionResult) return;

        if (!teamA || !teamB) {
            predictionResult.innerHTML = '<div class="prediction-error">Please enter both team names to predict.</div>';
            return;
        }

        const prediction = predictMatchWinner(matches, teamA, teamB);
        renderPredictionResult(prediction, teamA, teamB);
    } catch (error) {
        console.error('handlePredict: Error running prediction', error);
    }
}

/**
 * Renders prediction result into the predictionResult container
 * @param {Object} prediction
 */
function renderPredictionResult(prediction, teamA, teamB) {
    if (!predictionResult) return;

    const winnerText = prediction.predictedWinner === 'Not enough data' ? 'Not enough data' : `Predicted: ${prediction.predictedWinner}`;

    const html = `
        <div class="prediction-result-card">
            <div class="prediction-header">
                <div class="prediction-winner">${winnerText}</div>
            </div>
            <div class="prediction-body">
                <div class="prediction-pair">
                    <div class="team">
                        <div class="team-name">${teamA}</div>
                        <div class="team-chance">${prediction.teamAChance}%</div>
                        <div class="chance-bar"><div class="fill" style="width: ${prediction.teamAChance}%; background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));"></div></div>
                    </div>
                    <div class="team vs">vs</div>
                    <div class="team">
                        <div class="team-name">${teamB}</div>
                        <div class="team-chance">${prediction.teamBChance}%</div>
                        <div class="chance-bar"><div class="fill" style="width: ${prediction.teamBChance}%; background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));"></div></div>
                    </div>
                </div>
                <div class="prediction-reason">${prediction.reason}</div>
            </div>
        </div>
    `;

    predictionResult.innerHTML = html;
}

/**
 * Creates a simple tournament statistic card
 * @param {string} title - Card title
 * @param {string} value - Card value/content
 * @param {string} icon - Emoji icon for the card
 * @returns {HTMLElement} Tournament stat card element
 */
function createStatCard(title, value, icon) {
    const card = document.createElement('div');
    card.className = 'tournament-stat-card';
    card.innerHTML = `
        <div class="stat-icon">${icon}</div>
        <div class="stat-title">${title}</div>
        <div class="stat-value">${value}</div>
    `;
    return card;
}
function initializeApp() {
    console.log('Initializing World Cup Dashboard 2026...');
    
    // Load matches from localStorage
    loadMatchesFromStorage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Render initial matches
    renderMatches(matches);
    
    // Render group standings
    renderGroupStandings();
    
    // Render tournament statistics
    renderTournamentStatistics();
    
    // Update statistics
    updateStatistics();
    
    console.log('✓ Dashboard initialized successfully');
}

/**
 * Loads matches from localStorage on startup
 */
function loadMatchesFromStorage() {
    try {
        matches = loadMatches();
        console.log(`Loaded ${matches.length} matches from storage`);
    } catch (error) {
        console.error('Error loading matches from storage:', error);
        matches = [];
    }
}

/**
 * Sets up all event listeners
 */
function setupEventListeners() {
    // Form submission
    if (matchForm) {
        matchForm.addEventListener('submit', handleAddMatch);
    }

    // Search input
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }

    // Prediction button
    if (predictButton) {
        predictButton.addEventListener('click', handlePredict);
    }
}

/**
 * Handles the Add Match form submission
 * @param {Event} event - Form submission event
 */
function handleAddMatch(event) {
    event.preventDefault();

    // Get form input values
    const homeTeam = homeTeamInput.value.trim();
    const awayTeam = awayTeamInput.value.trim();
    const group = groupInput.value.trim();
    const date = dateInput.value;
    const score = scoreInput.value.trim();

    // Validate inputs
    if (!homeTeam || !awayTeam || !group || !date || !score) {
        alert('Please fill in all fields');
        return;
    }

    try {
        // Create new Match object
        const newMatch = new Match(homeTeam, awayTeam, group, date, score);

        // Validate match object
        if (!newMatch.isValid()) {
            alert('Invalid match data');
            return;
        }

        // Add to matches array
        matches.push(newMatch);

        // Save to localStorage
        saveMatches(matches);

        // Reset form
        matchForm.reset();

        // Refresh UI - render filtered matches to preserve search
        renderMatches(getFilteredMatches());
        renderGroupStandings();
        renderTournamentStatistics();
        updateStatistics();

        console.log(`✓ Match added: ${newMatch.toString()}`);
    } catch (error) {
        console.error('Error adding match:', error);
        alert('Error adding match. Please try again.');
    }
}

/**
 * Renders all matches as cards in the matches container
 * @param {Array<Match>} matchesToRender - Array of Match objects to render
 */
function renderMatches(matchesToRender) {
    if (!matchesContainer) {
        console.error('Matches container not found');
        return;
    }

    // Clear existing matches
    matchesContainer.innerHTML = '';

    // Handle empty state
    if (!matchesToRender || matchesToRender.length === 0) {
        matchesContainer.innerHTML = '<div class="empty-state"><p>No matches found. Add a new match to get started!</p></div>';
        return;
    }

    // Create and append match cards (preserve global indexes so handlers work correctly)
    matchesToRender.forEach((match) => {
        // Try to find the match's global index in the main matches array
        let globalIndex = matches.indexOf(match);
        if (globalIndex === -1) {
            // Fallback: match by identifying fields
            globalIndex = matches.findIndex(m =>
                m && match &&
                m.homeTeam === match.homeTeam &&
                m.awayTeam === match.awayTeam &&
                m.date === match.date &&
                m.score === match.score &&
                m.group === match.group
            );
        }

        const matchCard = createMatchCard(match, globalIndex);
        matchesContainer.appendChild(matchCard);
    });

    console.log(`✓ Rendered ${matchesToRender.length} matches`);
}

/**
 * Creates a match card element
 * @param {Match} match - Match object
 * @param {number} index - Index of match in array
 * @returns {HTMLElement} Match card element
 */
function createMatchCard(match, index) {
    const card = document.createElement('div');
    card.className = 'match-card';

    // Format date
    const matchDate = new Date(match.date);
    const formattedDate = matchDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Create card HTML
    card.innerHTML = `
        <div class="match-header">
            <span class="match-group">${match.group}</span>
            <span class="match-date">${formattedDate}</span>
        </div>
        
        <div class="match-body">
            <div class="match-teams">
                <div class="match-team">
                    <div class="team-name">${match.homeTeam}</div>
                </div>
                <div class="match-score">${match.score}</div>
                <div class="match-team">
                    <div class="team-name">${match.awayTeam}</div>
                </div>
            </div>
        </div>
        
        <div class="match-footer">
            <button class="btn-small btn-favorite ${match.favorite ? 'active' : ''}" title="Toggle favorite">
                ⭐ Favorite
            </button>
            <button class="btn-small btn-watched ${match.watched ? 'active' : ''}" title="Toggle watched">
                ✓ Watched
            </button>
            <button class="btn-small btn-delete" title="Delete match">
                🗑 Delete
            </button>
        </div>
    `;

    // Add event listeners to buttons
    const favoriteBtn = card.querySelector('.btn-favorite');
    const watchedBtn = card.querySelector('.btn-watched');
    const deleteBtn = card.querySelector('.btn-delete');

    favoriteBtn.addEventListener('click', () => handleToggleFavorite(index));
    watchedBtn.addEventListener('click', () => handleToggleWatched(index));
    deleteBtn.addEventListener('click', () => handleDeleteMatch(index));

    return card;
}

/**
 * Toggles the favorite status of a match
 * @param {number} index - Index of match in array
 */
function handleToggleFavorite(index) {
    try {
        if (matches[index]) {
            matches[index].toggleFavorite();
            saveMatches(matches);
            renderMatches(getFilteredMatches());
                        renderGroupStandings();
            renderTournamentStatistics();
            updateStatistics();
            console.log(`✓ Favorite toggled for match ${index + 1}`);
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
    }
}

/**
 * Toggles the watched status of a match
 * @param {number} index - Index of match in array
 */
function handleToggleWatched(index) {
    try {
        if (matches[index]) {
            matches[index].toggleWatched();
                        renderGroupStandings();
            saveMatches(matches);
            renderMatches(getFilteredMatches());
            renderTournamentStatistics();
            updateStatistics();
            console.log(`✓ Watched toggled for match ${index + 1}`);
        }
    } catch (error) {
        console.error('Error toggling watched:', error);
    }
}

/**
 * Deletes a match from the array
 * @param {number} index - Index of match to delete
 */
function handleDeleteMatch(index) {
    try {
        if (confirm('Are you sure you want to delete this match?')) {
            matches.splice(index, 1);
            saveMatches(matches);
            renderMatches(getFilteredMatches());
            renderGroupStandings();
            renderTournamentStatistics();
            updateStatistics();
            console.log(`✓ Match ${index + 1} deleted`);
        }
    } catch (error) {
        console.error('Error deleting match:', error);
    }
}

/**
 * Handles search input and filters matches
 */
function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        renderMatches(matches);
        return;
    }

    const filteredMatches = matches.filter(match => {
        return (
            match.homeTeam.toLowerCase().includes(searchTerm) ||
            match.awayTeam.toLowerCase().includes(searchTerm) ||
            match.group.toLowerCase().includes(searchTerm)
        );
    });

    renderMatches(filteredMatches);
    console.log(`Search: Found ${filteredMatches.length} matches for "${searchTerm}"`);
}

/**
 * Gets filtered matches based on current search
 * @returns {Array<Match>} Filtered matches array
 */
function getFilteredMatches() {
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    
    if (searchTerm === '') {
        return matches;
    }

    return matches.filter(match => {
        return (
            match.homeTeam.toLowerCase().includes(searchTerm) ||
            match.awayTeam.toLowerCase().includes(searchTerm) ||
            match.group.toLowerCase().includes(searchTerm)
        );
    });
}

/**
 * Updates the statistics cards with current data
 */
function updateStatistics() {
    try {
        const totalMatches = countMatches(matches);
        const watchedMatches = countWatchedMatches(matches);
        const favoriteMatches = countFavoriteMatches(matches);

        // Update DOM elements with animation
        animateStatisticUpdate(totalMatchesElement, totalMatches);
        animateStatisticUpdate(watchedMatchesElement, watchedMatches);
        animateStatisticUpdate(favoriteMatchesElement, favoriteMatches);

        console.log(`✓ Statistics updated - Total: ${totalMatches}, Watched: ${watchedMatches}, Favorite: ${favoriteMatches}`);
    } catch (error) {
        console.error('Error updating statistics:', error);
    }
}

/**
 * Animates statistic update with a visual effect
 * @param {HTMLElement} element - Element to update
 * @param {number} value - New value to display
 */
function animateStatisticUpdate(element, value) {
    if (!element) return;

    element.style.transition = 'none';
    element.style.transform = 'scale(0.8)';
    element.textContent = value;

    setTimeout(() => {
        element.style.transition = 'transform 0.3s ease-out';
        element.style.transform = 'scale(1)';
    }, 10);
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle page visibility to refresh stats if needed
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateStatistics();
    }
});
