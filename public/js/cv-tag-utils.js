/**
 * CV Tag Filtering Utilities
 * A collection of utility functions for tag-based filtering in the CV
 */

/**
 * Gets the currently selected tags from all tag-toggle components
 * @param {string} selector - CSS selector for tag-toggle components (default: '#cv-tags-form tag-toggle')
 * @returns {string[]} Array of selected tag names
 */
export function getSelectedTags(selector = '#cv-tags-form tag-toggle') {
  return Array.from(document.querySelectorAll(selector))
    .filter(toggle => toggle.checked)
    .map(toggle => toggle.name.trim());
}

/**
 * Checks if a set of tags passes the filtering criteria
 * @param {string} tagsAttr - Comma-separated tags attribute value
 * @param {string[]} checkedTags - Array of currently selected tag names
 * @param {string[]} availableTags - Array of all available tag names
 * @returns {boolean} Whether the tags pass the filtering criteria
 */
export function passesTagFiltering(tagsAttr, checkedTags, availableTags) {
  const tags = tagsAttr ?
    decodeURIComponent(tagsAttr).split(',').map(tag => tag.trim()) :
    [];

  // If no tags, show it regardless of filters
  if (!tags.length) {
    return true;
  }

  // If it has tags:
  // - Hide it when no filters are selected
  // - Only show it if one of its tags matches the checked filters
  return checkedTags.length > 0 && tags.some(function(tag) {
    const normalizedTag = tag.trim();
    return availableTags.includes(normalizedTag) && checkedTags.includes(normalizedTag);
  });
}
