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

/**
 * Initializes the application on page load
 */
function initializeApp() {
    console.log('Initializing World Cup Dashboard 2026...');
    
    // Load matches from localStorage
    loadMatchesFromStorage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Render initial matches
    renderMatches(matches);
    
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

        // Refresh UI
        renderMatches(matches);
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

    // Create and append match cards
    matchesToRender.forEach((match, index) => {
        const matchCard = createMatchCard(match, index);
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
            saveMatches(matches);
            renderMatches(getFilteredMatches());
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

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle page visibility to refresh stats if needed
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateStatistics();
    }
});
