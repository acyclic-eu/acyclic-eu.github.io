  // Methods for filtering
  isVisible(checkedTags, yearDepth) {
    // Get tags attribute directly
    const tagsAttr = this.getAttribute('tags');

    // If no tags or tags="always", always show this experience
    // Otherwise, only show if one of its tags matches the selected filters
    const passesTagFilter = tagsAttr === null || tagsAttr === '' || tagsAttr === 'always' ||
                          (checkedTags.length > 0 && this.tags.some(tag => checkedTags.includes(tag)));
