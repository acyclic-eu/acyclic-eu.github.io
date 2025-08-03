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

  .traits {
    margin-top: -10px;
    margin-bottom: 10px;
    color: #666;
    font-size: 0.9em;
  }
</style>

<!-- Use the tag_filters from the YAML file with null check -->
{% assign ordered_tags = site.data.cv.tag_filters | default: '' | sort: "order" %}

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

<div id="cv-content">
{% assign exps = site.data.cv.experiences | sort: "start_date" | reverse %}
{% for exp in exps %}
  <div class="experience" data-exp-tags="{{ exp.tags | join: ',' | uri_escape | default: '' }}" data-end-date="{{ exp.end_date | default: 'Present' }}">
    {% assign title_parts = exp.title | split: "(" %}
    {% if title_parts.size > 1 %}
      {% assign main_title = title_parts[0] | strip %}
      {% assign traits_with_paren = title_parts[1] | split: ")" %}
      {% assign traits = traits_with_paren[0] %}
      <h2>{{ main_title }} at {{ exp.company }}</h2>
      <p class="traits"><em>{{ traits }}</em></p>
    {% else %}
      <h2>{{ exp.title }} at {{ exp.company }}</h2>
    {% endif %}
    <p><strong>Location:</strong> {{ exp.location | default: "N/A" }}<br>
    <strong>Period:</strong> {{ exp.start_date | default: "N/A" }} - {{ exp.end_date | default: "Present" }} ({{ exp.employment_type | default: "Employed" }})
    </p>
    <ul>
      {% for desc in exp.descriptions %}
        {% if desc.tags == nil or desc.tags == empty %}
          <li data-tags="" class="tag-no-tags">{{ desc.text | escape }}</li>
        {% else %}
          <li data-tags="{{ desc.tags | join: ',' | uri_escape }}">{{ desc.text }}</li>
        {% endif %}
      {% endfor %}
    </ul>
  </div>
{% endfor %}
</div>

<!-- Import the web components -->
<script type="module">
  import "/public/Componenets/tag-toggle.js";
  import "/public/Componenets/time-filter.js";
</script>

<script>

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

  // Simple inline tag filtering function
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

  console.log('Checked tags:', selectedTags);

  // Filter experiences based on their tags and end date
  var experiences = document.querySelectorAll('#cv-content .experience');
  experiences.forEach(function(exp) {
    var expTagsAttr = exp.getAttribute('data-exp-tags');
    var endDateStr = exp.getAttribute('data-end-date');

    // Parse the end date
    var endDate;
    if (endDateStr === "Present") {
      endDate = new Date();
    } else {
      endDate = new Date(endDateStr);
    }

    var passesTagFilter = passesTagFiltering(expTagsAttr);
    var passesDateFilter = yearDepth === 0 ?
                          (endDateStr === "Present") :
                          (endDateStr === "Present" || endDate >= cutoffDate);


    if (passesTagFilter && passesDateFilter) {
      exp.style.display = '';
    } else {
      exp.style.display = 'none';
    }
  });

  // Filter descriptions based on their tags
  var lis = document.querySelectorAll('#cv-content li');
  lis.forEach(function(li) {
    var tagsAttr = li.getAttribute('data-tags');
    var passesTagFilter = passesTagFiltering(tagsAttr);

    if (passesTagFilter) {
      li.style.display = '';
    } else {
      li.style.display = 'none';
    }
  });
}

// Initialize filtering on page load
window.addEventListener('DOMContentLoaded', function() {
  // Wait for web components to be defined
  setTimeout(() => {
    // Add change event listeners to all tag-toggle components
    document.querySelectorAll('tag-toggle').forEach(toggle => {
      toggle.addEventListener('change', () => {
        console.log(`Toggle changed: ${toggle.name} is now ${toggle.checked ? 'checked' : 'unchecked'}`);
        filterCV();
      });
    });

    // Add change event listener to time-filter component
    const timeFilter = document.getElementById('experience-filter');
    if (timeFilter) {
      timeFilter.addEventListener('change', () => {
        console.log(`Time filter changed: ${timeFilter.value} years`);
        filterCV();
      });
    }

    filterCV();
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
