/**
 * Storage Manager
 * Handles persistence of matches data using localStorage
 */

const STORAGE_KEY = 'worldcup_dashboard_matches';

/**
 * Saves an array of Match objects to localStorage
 * Converts Match instances to plain objects before storage
 * @param {Array<Match>} matches - Array of Match instances to save
 * @returns {boolean} True if save was successful, false otherwise
 */
function saveMatches(matches) {
    try {
        // Validate input
        if (!Array.isArray(matches)) {
            console.error('saveMatches: Invalid input. Expected an array of matches.');
            return false;
        }

        // Convert Match objects to plain objects
        const matchesData = matches.map(match => {
            if (match instanceof Match) {
                return match.toObject();
            }
            return match;
        });

        // Convert to JSON string and save to localStorage
        const jsonString = JSON.stringify(matchesData);
        localStorage.setItem(STORAGE_KEY, jsonString);

        console.log(`✓ Successfully saved ${matches.length} matches to storage`);
        return true;
    } catch (error) {
        console.error('saveMatches: Error saving matches to localStorage', error);
        return false;
    }
}

/**
 * Loads matches from localStorage and converts them to Match objects
 * @returns {Array<Match>} Array of Match instances loaded from storage
 */
function loadMatches() {
    try {
        // Retrieve JSON string from localStorage
        const jsonString = localStorage.getItem(STORAGE_KEY);

        // Return empty array if no data exists
        if (!jsonString) {
            console.log('No matches found in storage');
            return [];
        }

        // Parse JSON string to get plain objects
        const matchesData = JSON.parse(jsonString);

        // Validate that parsed data is an array
        if (!Array.isArray(matchesData)) {
            console.error('loadMatches: Invalid data format in storage');
            return [];
        }

        // Convert plain objects to Match instances
        const matches = matchesData.map(matchData => Match.fromObject(matchData));

        console.log(`✓ Successfully loaded ${matches.length} matches from storage`);
        return matches;
    } catch (error) {
        console.error('loadMatches: Error loading matches from localStorage', error);
        return [];
    }
}

/**
 * Clears all matches from localStorage
 * @returns {boolean} True if clear was successful, false otherwise
 */
function clearMatches() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('✓ Successfully cleared all matches from storage');
        return true;
    } catch (error) {
        console.error('clearMatches: Error clearing matches from localStorage', error);
        return false;
    }
}

/**
 * Gets the count of matches stored in localStorage
 * @returns {number} Number of matches in storage
 */
function getMatchesCount() {
    try {
        const matches = loadMatches();
        return matches.length;
    } catch (error) {
        console.error('getMatchesCount: Error getting matches count', error);
        return 0;
    }
}

/**
 * Checks if localStorage is available and accessible
 * @returns {boolean} True if localStorage is available, false otherwise
 */
function isStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (error) {
        console.warn('Storage is not available:', error);
        return false;
    }
}

/**
 * Exports storage functions for use in other modules
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveMatches,
        loadMatches,
        clearMatches,
        getMatchesCount,
        isStorageAvailable
    };
}
