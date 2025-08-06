---
layout: default
title: CV
permalink: /cv/
---

{% if site.data.cv.name %}
<div style="display: flex; align-items: baseline; gap: 15px;">
  <h1 style="margin-bottom: 0;">{{ site.data.cv.name }}</h1>
  <h3 style="margin-bottom: 0; font-weight: normal; color: #777;">Curriculum Vitae</h3>
</div>
{% else %}
<h1>Curriculum Vitae</h1>
{% endif %}

<style>
  :root {
    /* Theme colors for components */
    --secondary: #d291ff;
    --secondary-contrast: black;
    --button-bg: #f0f0f0;
    --button-text: black;
  }

</style>

<!-- Use the tag_filters from the YAML file with null check -->
{% assign ordered_tags = site.data.cv.tag_filters | default: '' %}

<!-- Calculate the maximum timespan based on the earliest start_date -->
{% assign experiences = site.data.cv.experiences %}
{% assign current_year = "now" | date: "%Y" | plus: 0 %}
{% assign earliest_date = current_year %}
{% for exp in experiences %}
  {% if exp.start_date %}
    {% assign year = exp.start_date | slice: 0, 4 | plus: 0 %}
    {% if year < earliest_date %}
      {% assign earliest_date = year %}
    {% endif %}
  {% endif %}
{% endfor %}
{% assign max_years = current_year | minus: earliest_date | plus: 1 %}

<h2>Filter by Role</h2>
<form id="cv-tags-form">
  {% if ordered_tags != '' %}
    {% for tag_filter in ordered_tags %}
      <tag-toggle
        id="tag-{{ tag_filter.name | slugify }}"
        name="{{ tag_filter.name }}"
        description="{{ tag_filter.description | escape }}"
      ></tag-toggle>
    {% endfor %}
  {% else %}
    <!-- No tag filters available -->
    <div><em>No filters available</em></div>
  {% endif %}
  <div style="margin-top:1em;">
    <time-filter
      id="experience-filter"
      value="10"
      min="0"
      max="{{ max_years }}"
      label="Experience Timeframe"
      minLabel="Current only"
      maxLabel="All experience"
    ></time-filter>
    <div style="text-align: right; margin-top: 1em;">
      <button id="export-markdown" class="btn" style="padding: 0.5em 1em; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 3px; cursor: pointer;" onclick="exportToMarkdown()">Export as Markdown</button>
    </div>
  </div>
</form>

<div id="cv-content"></div>

<!-- Import the web components -->
<script type="module">
  import "/public/Components/tag-toggle.js";
  import "/public/Components/time-filter.js";
  import "/public/Components/cv-experience.js";
</script>

<script>

let cvData = null;
let filteredCvData = null;

fetch('/cv/cv.json')
  .then(response => response.json())
  .then(data => {
    cvData = data;
    filteredCvData = filterCvData();
    console.log('cv:', cvData);
    console.log('filteredCvData:', filteredCvData);
  })
  .catch(err => console.error('Failed to load cv.json', err));

function filterCvData() {
  if (!cvData) return null;
  const yearDepth = parseInt(document.getElementById('experience-filter')?.value || '0');
  const today = new Date();

  return {
    ...cvData,
    experiences: cvData.experiences
      .filter(exp => {
        // Date filter
        let isCurrent = exp.end_date === "Present" || !exp.end_date;
        let endDateObj = isCurrent ? today : new Date(exp.end_date);
        let passesDate = yearDepth === 0 ? isCurrent : (isCurrent || endDateObj >= cutoffDate);
        if (!passesDate) return false;
        if (!passesTagFiltering(exp.tags)) return false;
        return true;
      })
      .sort((a, b) => {
        // Sort by end_date (newest first), then start_date (newest first)
        function parseDate(dateStr, fallback) {
          if (!dateStr || dateStr === "Present") return new Date(8640000000000000); // Far future
          const d = new Date(dateStr);
          return isNaN(d) ? fallback : d;
        }
        const aEnd = parseDate(a.end_date, new Date(0));
        const bEnd = parseDate(b.end_date, new Date(0));
        if (bEnd - aEnd !== 0) return bEnd - aEnd;
        const aStart = parseDate(a.start_date, new Date(0));
        const bStart = parseDate(b.start_date, new Date(0));
        return bStart - aStart;
      })
      .map(exp => ({
        ...exp,
        descriptions: (exp.descriptions || []).filter(desc => passesTagFiltering(desc.tags))
      }))
  };
}

function renderCvContent() {
  const container = document.getElementById('cv-content');
  if (!filteredCvData || !filteredCvData.experiences) {
    container.innerHTML = '<em>No experiences to display.</em>';
    return;
  }
  container.innerHTML = filteredCvData.experiences.map(exp => {
    const traits = exp.traits ? exp.traits.join(', ') : '';
    const tags = exp.tags ? exp.tags.join(',') : '';
    const employmentType = exp.employment_type || 'Employed';
    const endDate = exp.end_date || 'Present';
    const descriptions = (exp.descriptions || []).map(desc => {
      const descTags = desc.tags ? desc.tags.join(',') : '';
      return `<li data-tags="${encodeURIComponent(descTags)}">${desc.text}</li>`;
    }).join('');
    return `
      <cv-experience
        title="${exp.title}"
        company="${exp.company}"
        traits="${traits}"
        location="${exp.location || 'N/A'}"
        start-date="${exp.start_date || 'N/A'}"
        end-date="${endDate}"
        employment-type="${employmentType}"
        exp-tags="${encodeURIComponent(tags)}"
        class="experience"
      >
        <ul>${descriptions}</ul>
      </cv-experience>
    `;
  }).join('');
}

function onFilterChange() {
  filteredCvData = filterCvData();
  console.log('filteredCvData:', filteredCvData);
  renderCvContent();
}

// Simple normalize function to trim whitespace
function normalizeTag(tag) {
  return tag.trim();
}

// Helper function to get selected tags
function getSelectedTags() {
  return Array.from(document.querySelectorAll('#cv-tags-form tag-toggle'))
    .filter(toggle => toggle.checked)
    .map(toggle => toggle.name.trim());
}

function filterCV() {
  // Available tags from the YAML file
  const availableTags = [{% for tag_filter in site.data.cv.tag_filters %}"{{ tag_filter.name }}"{% unless forloop.last %},{% endunless %}{% endfor %}];

  const selectedTags = getSelectedTags();
console.log('Selected tags:', selectedTags);

var yearDepth = parseInt(document.getElementById('experience-filter').value);

  // Calculate cutoff date based on year depth
  var today = new Date();
  var cutoffYear = today.getFullYear() - yearDepth;
  var cutoffDate = new Date(cutoffYear, today.getMonth(), today.getDate());

  function passesTagFiltering(tagsAttr) {
    // Parse the tags from the attribute
    var tags = tagsAttr ? decodeURIComponent(tagsAttr).split(',').map(tag => tag.trim()) : [];

    // If no tags, show it regardless of filters
    if (!tags.length) {
      return true;
    }

    // If no filters selected, always hide tagged items
    if (selectedTags.length === 0) {
      return false;
    }

    // Check if any tag matches the checked filters
    const passes = tags.some(tag => {
      const matches = availableTags.includes(tag) && selectedTags.includes(tag);
      return matches;
    });

    return passes;
  }

  // Helper for date filtering
  function passesDateFiltering(endDateStr) {
    if (!endDateStr || endDateStr === "Present") return true;
    var endDate = new Date(endDateStr);
    if (isNaN(endDate)) return false;
    if (yearDepth === 0) {
      // Only current (no end date or 'Present')
      return false;
    } else {
      return endDate >= cutoffDate;
    }
  }

  // Filter experiences based on their tags and end date
  var experiences = document.querySelectorAll('#cv-content .experience');
  experiences.forEach(function(exp) {
    var expTagsAttr = exp.getAttribute('data-exp-tags');
    var endDateStr = exp.getAttribute('data-end-date');

    var passesTagFilter = passesTagFiltering(expTagsAttr);
    var passesDateFilter = passesDateFiltering(endDateStr);

    if ((selectedTags.length === 0 ? passesDateFilter : (passesTagFilter && passesDateFilter))) {
      exp.style.display = '';
    } else {
      exp.style.display = 'none';
    }
  });

  // Filter descriptions based on their tags
  var lis = document.querySelectorAll('#cv-content li');
  lis.forEach(function(li) {
    var tagsAttr = li.getAttribute('data-tags');
    var tags = tagsAttr ? decodeURIComponent(tagsAttr).split(',').map(tag => tag.trim()).filter(Boolean) : [];
    // Show if no tags, otherwise only if tag matches selected
    var passesTagFilter = tags.length === 0 || (selectedTags.length > 0 && tags.some(tag => selectedTags.includes(tag)));
    if (passesTagFilter) {
      li.style.display = '';
    } else {
      li.style.display = 'none';
    }
  });
}

// Initialize filtering on page load
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    document.querySelectorAll('tag-toggle').forEach(toggle => {
      toggle.addEventListener('change', () => {
        filterCV();
        onFilterChange();
      });
    });
    const timeFilter = document.getElementById('experience-filter');
    if (timeFilter) {
      timeFilter.addEventListener('change', () => {
        filterCV();
        onFilterChange();
      });
    }
    filterCV();
    onFilterChange();
  }, 100);
});

function exportToMarkdown() {
  // Get the active filters
  const activeFilters = getSelectedTags();
  const yearDepth = document.getElementById('experience-filter').value;

  // Start building the markdown content
  let markdown = `# Curriculum Vitae\n\n`;

  // Add filter information
  if (activeFilters.length > 0) {
    markdown += `*Filtered by roles: ${activeFilters.join(', ')}*\n\n`;
  }
  markdown += `*Experience timeframe: ${yearDepth} years*\n\n`;

  // Get all visible experiences
  const visibleExperiences = Array.from(document.querySelectorAll('.experience'))
    .filter(exp => exp.style.display !== 'none');

  visibleExperiences.forEach(exp => {
    // Get the title
    const title = exp.querySelector('h2').textContent;
    markdown += `## ${title}\n\n`;

    // Get location and period
    const details = exp.querySelector('p').textContent;
    markdown += `${details}\n\n`;

    // Get the visible description items
    const visibleItems = Array.from(exp.querySelectorAll('li'))
      .filter(li => li.style.display !== 'none');

    if (visibleItems.length > 0) {
      visibleItems.forEach(item => {
        markdown += `- ${item.textContent}\n`;
      });
      markdown += '\n';
    }
  });

  // Create and trigger download
  const blob = new Blob([markdown], {type: 'text/markdown'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  // Create a filename with name and date
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format

  // Get name from data file or fallback to configured value
  let nameForFilename = '{{ site.data.cv.name }}';

  // If the template variable doesn't render, use site author name
  if (!nameForFilename || nameForFilename === '{{ site.data.cv.name }}') {
    nameForFilename = '{{ site.author.name }}';
  }

  // Slugify the name manually (convert to lowercase, replace spaces with hyphens)
  const nameSlug = nameForFilename.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  // Create the filename with the name and selected filters
  let filename = nameSlug;

  // Add selected filters to filename
  if (activeFilters.length > 0) {
    filename += '_' + activeFilters.map(tag => tag.toLowerCase().replace(/\s+/g, '-')).join('-');
  }

  // Add date and extension
  filename += '_cv_' + dateStr + '.md';

  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
</script>
