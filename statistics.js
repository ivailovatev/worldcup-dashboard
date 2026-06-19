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
 * Parses score string and returns home and away goals
 * @param {string} score - Score string (e.g., '2-1')
 * @returns {Object} Object with homeGoals and awayGoals
 */
function parseScore(score) {
    try {
        const parts = score.trim().split('-');
        if (parts.length !== 2) {
            console.warn('parseScore: Invalid score format:', score);
            return { homeGoals: 0, awayGoals: 0 };
        }
        
        const homeGoals = parseInt(parts[0].trim(), 10);
        const awayGoals = parseInt(parts[1].trim(), 10);
        
        if (isNaN(homeGoals) || isNaN(awayGoals)) {
            console.warn('parseScore: Non-numeric goals in score:', score);
            return { homeGoals: 0, awayGoals: 0 };
        }
        
        return { homeGoals, awayGoals };
    } catch (error) {
        console.error('parseScore: Error parsing score:', error);
        return { homeGoals: 0, awayGoals: 0 };
    }
}

/**
 * Calculates group standings based on matches
 * Returns teams organized by group with calculated statistics
 * Standings are sorted by points (desc), goal difference (desc), goals for (desc)
 * @param {Array<Match>} matches - Array of Match instances
 * @returns {Object} Object with groups as keys and arrays of team standings as values
 */
function calculateGroupStandings(matches) {
    try {
        if (!Array.isArray(matches)) {
            console.warn('calculateGroupStandings: Expected an array, received:', typeof matches);
            return {};
        }

        // Initialize standings object
        const standings = {};
        const teamStats = {}; // temp storage: key = "teamName|group"

        // Process each match
        matches.forEach(match => {
            if (!match || !match.homeTeam || !match.awayTeam || !match.group || !match.score) {
                return;
            }

            const group = match.group.trim();
            const homeTeam = match.homeTeam.trim();
            const awayTeam = match.awayTeam.trim();
            
            // Parse score
            const { homeGoals, awayGoals } = parseScore(match.score);

            // Initialize group if needed
            if (!standings[group]) {
                standings[group] = {};
            }

            // Initialize team stats if needed
            const homeKey = `${homeTeam}|${group}`;
            const awayKey = `${awayTeam}|${group}`;

            if (!teamStats[homeKey]) {
                teamStats[homeKey] = {
                    team: homeTeam,
                    played: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goalsFor: 0,
                    goalsAgainst: 0
                };
            }

            if (!teamStats[awayKey]) {
                teamStats[awayKey] = {
                    team: awayTeam,
                    played: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goalsFor: 0,
                    goalsAgainst: 0
                };
            }

            // Update home team stats
            const homeStats = teamStats[homeKey];
            homeStats.played++;
            homeStats.goalsFor += homeGoals;
            homeStats.goalsAgainst += awayGoals;

            if (homeGoals > awayGoals) {
                homeStats.wins++;
            } else if (homeGoals === awayGoals) {
                homeStats.draws++;
            } else {
                homeStats.losses++;
            }

            // Update away team stats
            const awayStats = teamStats[awayKey];
            awayStats.played++;
            awayStats.goalsFor += awayGoals;
            awayStats.goalsAgainst += homeGoals;

            if (awayGoals > homeGoals) {
                awayStats.wins++;
            } else if (awayGoals === homeGoals) {
                awayStats.draws++;
            } else {
                awayStats.losses++;
            }
        });

        // Convert team stats to standings format and calculate points
        Object.entries(teamStats).forEach(([key, stats]) => {
            const points = (stats.wins * 3) + (stats.draws * 1);
            const goalDifference = stats.goalsFor - stats.goalsAgainst;
            
            const teamStanding = {
                team: stats.team,
                played: stats.played,
                wins: stats.wins,
                draws: stats.draws,
                losses: stats.losses,
                goalsFor: stats.goalsFor,
                goalsAgainst: stats.goalsAgainst,
                goalDifference: goalDifference,
                points: points
            };

            const group = key.split('|')[1];
            if (!standings[group][stats.team]) {
                standings[group][stats.team] = teamStanding;
            }
        });

        // Convert standing objects to arrays and sort
        const result = {};
        Object.entries(standings).forEach(([group, teams]) => {
            result[group] = Object.values(teams).sort((a, b) => {
                // Sort by: points (desc), goalDifference (desc), goalsFor (desc)
                if (b.points !== a.points) {
                    return b.points - a.points;
                }
                if (b.goalDifference !== a.goalDifference) {
                    return b.goalDifference - a.goalDifference;
                }
                return b.goalsFor - a.goalsFor;
            });
        });

        console.log('✓ Group standings calculated');
        return result;
    } catch (error) {
        console.error('calculateGroupStandings: Error calculating standings', error);
        return {};
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
        getStatisticsSummary,
        calculateGroupStandings,
        parseScore
    };
}
