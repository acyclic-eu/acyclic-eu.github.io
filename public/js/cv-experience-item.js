  // Methods for filtering
  function isVisible(checkedTags)
  {
    // If this item has no tags, show it regardless of filters
    if (!this.tags || this.tags.length === 0) {
      return true;
    }

    // If it has tags:
    // - Hide it when no filters are selected
    // - Only show it if one of its tags matches the checked filters
    return checkedTags.length > 0 && this.tags.some(tag => checkedTags.includes(tag));
  }
