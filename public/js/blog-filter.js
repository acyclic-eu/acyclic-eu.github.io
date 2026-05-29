// Blog archive tag filtering
// Uses tag-toggle web components to filter blog posts by Developer/Leader/Coach tags

async function initBlogFilter() {
  // Wait for tag-toggle components to be defined
  await customElements.whenDefined('tag-toggle');

  const form = document.getElementById('blog-tags-form');
  const archiveItems = document.querySelectorAll('.archive-item');
  const yearHeaders = document.querySelectorAll('.archive-year');
  const yearSections = document.querySelectorAll('.archive-posts');

  if (!form || archiveItems.length === 0) {
    console.warn('Blog filter: form or archive items not found');
    return;
  }

  function getSelectedTags() {
    const toggles = form.querySelectorAll('tag-toggle');
    const selected = [];
    toggles.forEach(toggle => {
      if (toggle.checked) {
        selected.push(toggle.getAttribute('name'));
      }
    });
    return selected;
  }

  function filterPosts() {
    const selectedTags = getSelectedTags();
    
    // If no tags selected, show all
    if (selectedTags.length === 0) {
      archiveItems.forEach(item => item.style.display = '');
      yearHeaders.forEach(header => header.style.display = '');
      yearSections.forEach(section => section.style.display = '');
      return;
    }

    // Filter each post
    archiveItems.forEach(item => {
      const postTags = item.getAttribute('data-tags').split(',').filter(t => t.trim());
      const matches = postTags.some(tag => selectedTags.includes(tag));
      item.style.display = matches ? '' : 'none';
    });

    // Hide year headers and sections if all posts for that year are hidden
    yearSections.forEach(section => {
      const year = section.getAttribute('data-year');
      const visiblePosts = section.querySelectorAll('.archive-item[style=""], .archive-item:not([style])');
      const hasVisiblePosts = Array.from(section.querySelectorAll('.archive-item')).some(
        item => item.style.display !== 'none'
      );
      
      section.style.display = hasVisiblePosts ? '' : 'none';
      
      // Hide corresponding year header
      const header = document.querySelector(`.archive-year[data-year="${year}"]`);
      if (header) {
        header.style.display = hasVisiblePosts ? '' : 'none';
      }
    });
  }

  // Listen to changes on all tag-toggles
  form.addEventListener('change', filterPosts);
  
  // Initial filter (in case any toggles are pre-checked)
  filterPosts();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBlogFilter);
} else {
  initBlogFilter();
}
