/**
 * Get patterns from markdown files
 * 
 * @param {Object} patterns - The patterns object from import.meta.glob()
 * @returns {Array} Array of pattern objects with url and frontmatter
 */
export function getPatterns(patterns) {
    return Object.values(patterns)
        .filter(pattern => !pattern.frontmatter.draft)
        .map(pattern => ({
            url: pattern.url,
            frontmatter: pattern.frontmatter
        }))
        .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
}

/**
 * Get blog posts from markdown files and sort by date
 * 
 * @param {Object} posts - The posts object from import.meta.glob()
 * @returns {Array} Array of post objects sorted by date (newest first)
 */
export function getBlogPosts(posts) {
    return Object.values(posts)
        .filter(post => !post.frontmatter.draft)
        .map(post => ({
            url: post.url,
            frontmatter: post.frontmatter
        }))
        .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
}

/**
 * Get CSS class for status badge
 * 
 * @param {string} status - The status value (draft, experimental, stable, deprecated)
 * @returns {string} The corresponding GOV.UK tag class
 */
export function getStatusTagClass(status) {
    const statusMap = {
        'draft': 'govuk-tag--grey',
        'experimental': 'govuk-tag--orange',
        'stable': 'govuk-tag--green',
        'deprecated': 'govuk-tag--red'
    }

    return statusMap[status?.toLowerCase()] || 'govuk-tag--grey'
}
