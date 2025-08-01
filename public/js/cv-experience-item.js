  // Methods for filtering
  isVisible(checkedTags, yearDepth) {
    // Get tags directly from the component's tags property
    // If no filters are selected, show all experiences
    // Otherwise, only show if one of its tags matches the selected filters
    const passesTagFilter = checkedTags.length === 0 ||
                          (checkedTags.length > 0 && this.tags.length > 0 && this.tags.some(tag => checkedTags.includes(tag)));
