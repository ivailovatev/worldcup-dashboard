/**
 * Match Class
 * Represents a World Cup match with team information, date, score, and user interactions
 */

class Match {
    /**
     * Constructor for Match class
     * @param {string} homeTeam - Name of the home team
     * @param {string} awayTeam - Name of the away team
     * @param {string} group - Group identifier (e.g., 'Group A')
     * @param {string} date - Match date and time
     * @param {string} score - Match score (e.g., '2-1')
     * @param {boolean} watched - Whether the match has been watched (default: false)
     * @param {boolean} favorite - Whether the match is marked as favorite (default: false)
     */
    constructor(homeTeam, awayTeam, group, date, score, watched = false, favorite = false) {
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.group = group;
        this.date = date;
        this.score = score;
        this.watched = watched;
        this.favorite = favorite;
    }

    /**
     * Converts the Match instance to a plain JavaScript object
     * Useful for serialization and storage
     * @returns {Object} Plain object representation of the match
     */
    toObject() {
        return {
            homeTeam: this.homeTeam,
            awayTeam: this.awayTeam,
            group: this.group,
            date: this.date,
            score: this.score,
            watched: this.watched,
            favorite: this.favorite
        };
    }

    /**
     * Creates a Match instance from a plain JavaScript object
     * Useful for deserialization and retrieval from storage
     * @param {Object} obj - Plain object with match data
     * @returns {Match} New Match instance
     */
    static fromObject(obj) {
        if (!obj) {
            return null;
        }

        return new Match(
            obj.homeTeam || '',
            obj.awayTeam || '',
            obj.group || '',
            obj.date || '',
            obj.score || '',
            obj.watched || false,
            obj.favorite || false
        );
    }

    /**
     * Gets a formatted string representation of the match
     * @returns {string} Formatted match string
     */
    toString() {
        return `${this.homeTeam} vs ${this.awayTeam} (${this.group}) - ${this.score}`;
    }

    /**
     * Checks if the match has been watched
     * @returns {boolean} True if watched, false otherwise
     */
    isWatched() {
        return this.watched;
    }

    /**
     * Marks the match as watched
     */
    markAsWatched() {
        this.watched = true;
    }

    /**
     * Marks the match as not watched
     */
    unmarkAsWatched() {
        this.watched = false;
    }

    /**
     * Checks if the match is marked as favorite
     * @returns {boolean} True if favorite, false otherwise
     */
    isFavorite() {
        return this.favorite;
    }

    /**
     * Marks the match as favorite
     */
    markAsFavorite() {
        this.favorite = true;
    }

    /**
     * Removes the favorite mark from the match
     */
    unmarkAsFavorite() {
        this.favorite = false;
    }

    /**
     * Toggles the watched status of the match
     */
    toggleWatched() {
        this.watched = !this.watched;
    }

    /**
     * Toggles the favorite status of the match
     */
    toggleFavorite() {
        this.favorite = !this.favorite;
    }

    /**
     * Validates if the match has all required data
     * @returns {boolean} True if all required fields are present and valid
     */
    isValid() {
        return (
            this.homeTeam &&
            this.homeTeam.trim() !== '' &&
            this.awayTeam &&
            this.awayTeam.trim() !== '' &&
            this.group &&
            this.group.trim() !== '' &&
            this.date &&
            this.date.trim() !== '' &&
            this.score &&
            this.score.trim() !== ''
        );
    }
}
