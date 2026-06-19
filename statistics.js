/**
 * Statistics Manager
 * Provides analytical functions for World Cup match data
 */

/**
 * Counts the total number of matches
 * @param {Array<Match>} matches - Array of Match instances
 * @returns {number} Total number of matches
 */
function countMatches(matches) {
    try {
        if (!Array.isArray(matches)) {
            console.warn('countMatches: Expected an array, received:', typeof matches);
            return 0;
        }
        return matches.length;
    } catch (error) {
        console.error('countMatches: Error counting matches', error);
        return 0;
    }
}

/**
 * Counts the number of matches that have been watched
 * @param {Array<Match>} matches - Array of Match instances
 * @returns {number} Number of watched matches
 */
function countWatchedMatches(matches) {
    try {
        if (!Array.isArray(matches)) {
            console.warn('countWatchedMatches: Expected an array, received:', typeof matches);
            return 0;
        }
        return matches.filter(match => match && match.watched === true).length;
    } catch (error) {
        console.error('countWatchedMatches: Error counting watched matches', error);
        return 0;
    }
}

/**
 * Counts the number of matches marked as favorites
 * @param {Array<Match>} matches - Array of Match instances
 * @returns {number} Number of favorite matches
 */
function countFavoriteMatches(matches) {
    try {
        if (!Array.isArray(matches)) {
            console.warn('countFavoriteMatches: Expected an array, received:', typeof matches);
            return 0;
        }
        return matches.filter(match => match && match.favorite === true).length;
    } catch (error) {
        console.error('countFavoriteMatches: Error counting favorite matches', error);
        return 0;
    }
}

/**
 * Counts the number of matches in a specific group
 * @param {Array<Match>} matches - Array of Match instances
 * @param {string} group - Group identifier (e.g., 'Group A')
 * @returns {number} Number of matches in the specified group
 */
function countByGroup(matches, group) {
    try {
        if (!Array.isArray(matches)) {
            console.warn('countByGroup: Expected an array, received:', typeof matches);
            return 0;
        }

        if (!group || typeof group !== 'string') {
            console.warn('countByGroup: Invalid group parameter');
            return 0;
        }

        return matches.filter(match => match && match.group === group).length;
    } catch (error) {
        console.error('countByGroup: Error counting matches by group', error);
        return 0;
    }
}

/**
 * Calculates the percentage of matches that have been watched
 * @param {Array<Match>} matches - Array of Match instances
 * @returns {number} Watch percentage (0-100), or 0 if no matches exist
 */
function watchPercentage(matches) {
    try {
        if (!Array.isArray(matches)) {
            console.warn('watchPercentage: Expected an array, received:', typeof matches);
            return 0;
        }

        const totalMatches = countMatches(matches);
        
        // Return 0 if there are no matches
        if (totalMatches === 0) {
            return 0;
        }

        const watchedMatches = countWatchedMatches(matches);
        const percentage = (watchedMatches / totalMatches) * 100;

        // Round to 2 decimal places
        return Math.round(percentage * 100) / 100;
    } catch (error) {
        console.error('watchPercentage: Error calculating watch percentage', error);
        return 0;
    }
}

/**
 * Gets all unique groups from the matches
 * @param {Array<Match>} matches - Array of Match instances
 * @returns {Array<string>} Array of unique group identifiers
 */
function getUniqueGroups(matches) {
    try {
        if (!Array.isArray(matches)) {
            console.warn('getUniqueGroups: Expected an array, received:', typeof matches);
            return [];
        }

        const groups = new Set(matches.filter(match => match && match.group).map(match => match.group));
        return Array.from(groups).sort();
    } catch (error) {
        console.error('getUniqueGroups: Error getting unique groups', error);
        return [];
    }
}

/**
 * Gets statistics summary for all matches
 * @param {Array<Match>} matches - Array of Match instances
 * @returns {Object} Object containing various statistics
 */
function getStatisticsSummary(matches) {
    try {
        if (!Array.isArray(matches)) {
            console.warn('getStatisticsSummary: Expected an array, received:', typeof matches);
            return {
                totalMatches: 0,
                watchedMatches: 0,
                favoriteMatches: 0,
                watchPercentage: 0,
                uniqueGroups: []
            };
        }

        return {
            totalMatches: countMatches(matches),
            watchedMatches: countWatchedMatches(matches),
            favoriteMatches: countFavoriteMatches(matches),
            watchPercentage: watchPercentage(matches),
            uniqueGroups: getUniqueGroups(matches)
        };
    } catch (error) {
        console.error('getStatisticsSummary: Error getting statistics summary', error);
        return {
            totalMatches: 0,
            watchedMatches: 0,
            favoriteMatches: 0,
            watchPercentage: 0,
            uniqueGroups: []
        };
    }
}

/**
 * Exports statistics functions for use in other modules
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        countMatches,
        countWatchedMatches,
        countFavoriteMatches,
        countByGroup,
        watchPercentage,
        getUniqueGroups,
        getStatisticsSummary
    };
}
