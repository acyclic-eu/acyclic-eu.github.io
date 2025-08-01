---
layout: default
title: CV
permalink: /cv/
---

<h1>Curriculum Vitae</h1>

<style>
  .traits {
    margin-top: -10px;
    margin-bottom: 10px;
    color: #666;
    font-size: 0.9em;
  }

  .tag-filter {
    display: inline-block;
    margin-right: 1.5em;
    margin-bottom: 0.5em;
  }

  .tag-filter {
    position: relative;
  }

  .tag-filter label {
    cursor: pointer;
    padding: 0.3em 0.5em;
    border-radius: 3px;
    transition: all 0.2s ease;
  }

  .tag-filter input:checked + label {
    background-color: #e0e0e0;
  }

  .filter-description {
    display: none;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.5em;
    border-radius: 3px;
    font-size: 0.85em;
    width: max-content;
    max-width: 250px;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    margin-top: 5px;
  }

  .tag-filter:hover .filter-description {
    display: block;
  }
</style>

<!-- Use the tag_filters from the YAML file with null check -->
{% if site.data.cv.tag_filters %}
  {% assign ordered_tags = site.data.cv.tag_filters | sort: "order" %}
{% else %}
  {% assign ordered_tags = '' %}
{% endif %}

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
      <div class="tag-filter">
        <input type="checkbox" id="tag-{{ tag_filter.name | slugify }}" value="{{ tag_filter.name | uri_escape }}" onchange="filterCV()">
        <label for="tag-{{ tag_filter.name | slugify }}">{{ tag_filter.name }}</label>
        <div class="filter-description">{{ tag_filter.description }}</div>
      </div>
    {% endfor %}
  {% else %}
    <!-- No tag filters available -->
    <div><em>No filters available</em></div>
  {% endif %}
  <div style="margin-top:1em;">
    <div style="display:flex; align-items:center; margin-bottom:0.5em;">
      <label for="experience-age" style="margin-right:1em;">Experience Timeframe: <span id="year-depth-value">10</span> years</label>
      <div style="flex-grow:1;">
        <input type="range" id="experience-age" min="0" max="{{ max_years }}" value="10" step="1" style="width:100%;" onchange="updateYearDepthValue(this.value); filterCV();" oninput="updateYearDepthValue(this.value);">
        <div style="display:flex; justify-content:space-between; font-size:0.8em;">
          <span>Current only</span>
          <span>All experience ({{ max_years }} years)</span>
        </div>
      </div>
    </div>
    <div style="text-align: right; margin-top: 1em;">
      <button id="export-markdown" class="btn" style="padding: 0.5em 1em; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 3px; cursor: pointer;" onclick="exportToMarkdown()">Export as Markdown</button>
    </div>
  </div>
</form>

<div id="cv-content">
{% assign exps = site.data.cv.experiences | sort: "start_date" | reverse %}
{% for exp in exps %}
  {% if exp.tags %}
    <div class="experience" data-exp-tags="{{ exp.tags | join: ',' | uri_escape }}" data-end-date="{{ exp.end_date | default: 'Present' }}">
  {% else %}
    <div class="experience" data-exp-tags="always" data-end-date="{{ exp.end_date | default: 'Present' }}">
  {% endif %}
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
          <li data-tags="always" class="tag-always">{{ desc.text | escape }}</li>
        {% else %}
          <li data-tags="{{ desc.tags | join: ',' | uri_escape }}">{{ desc.text }}</li>
        {% endif %}
      {% endfor %}
    </ul>
  </div>
{% endfor %}
</div>

<script>
function updateYearDepthValue(value) {
  document.getElementById('year-depth-value').textContent = value;
}

// Simple normalize function to trim whitespace
function normalizeTag(tag) {
  return tag.trim();
}

function filterCV() {
  // Available tags from the YAML file
  const availableTags = [{% for tag_filter in site.data.cv.tag_filters %}"{{ tag_filter.name }}"{% unless forloop.last %},{% endunless %}{% endfor %}];

  var checked = Array.from(document.querySelectorAll('#cv-tags-form input[type=checkbox]:checked')).map(cb => decodeURIComponent(cb.value).trim());
  var yearDepth = parseInt(document.getElementById('experience-age').value);

  // Calculate cutoff date based on year depth
  var today = new Date();
  var cutoffYear = today.getFullYear() - yearDepth;
  var cutoffDate = new Date(cutoffYear, today.getMonth(), today.getDate());

  // Filter experiences based on their tags and end date
  var experiences = document.querySelectorAll('#cv-content .experience');
  experiences.forEach(function(exp) {
    var expTagsAttr = exp.getAttribute('data-exp-tags');
    var expTags = expTagsAttr ? decodeURIComponent(expTagsAttr).split(',').map(function(tag) { return tag.trim(); }) : [];
    var endDateStr = exp.getAttribute('data-end-date');

    // Parse the end date
    var endDate;
    if (endDateStr === "Present") {
      endDate = new Date();
    } else {
      endDate = new Date(endDateStr);
    }

    // Simple tag filter logic:
    // 1. If data-exp-tags is 'always', always show the experience
    // 2. Otherwise, show if any tag matches the checked filters
    var passesTagFilter = expTagsAttr === 'always' ||
                         (checked.length > 0 && expTags.some(function(tag) {
                           // Only consider tags that are defined in the YAML file
                           const normalizedTag = normalizeTag(tag);
                           return availableTags.includes(normalizedTag) && checked.includes(normalizedTag);
                         }));

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
    // If data-tags="always", always show this description
    if (tagsAttr === 'always') {
      li.style.display = '';
    } else {
      // Otherwise parse the tags and check if any match the filters
      var tags = decodeURIComponent(tagsAttr).split(',').map(function(tag) { return tag.trim(); });
      if (checked.length > 0 && tags.some(function(tag) {
        const normalizedTag = normalizeTag(tag);
        // Only consider tags that are defined in the YAML file
        return availableTags.includes(normalizedTag) && checked.includes(normalizedTag);
      })) {
        li.style.display = '';
      } else {
        li.style.display = 'none';
      }
    }
  });
}

// Initialize filtering on page load
window.addEventListener('DOMContentLoaded', function() {
  filterCV();
});

function exportToMarkdown() {
  // Get the active filters
  const activeFilters = Array.from(document.querySelectorAll('#cv-tags-form input[type=checkbox]:checked'))
    .map(cb => decodeURIComponent(cb.value).trim());
  const yearDepth = document.getElementById('year-depth-value').textContent;

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

  // Create a filename using the date, optionally including name if available
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format

  let filename = 'cv_' + dateStr;

  // Add name to filename if available
  const nameSlug = '{{ site.data.cv.name | slugify }}';
  if (nameSlug && nameSlug !== '{{ site.data.cv.name | slugify }}') {
    filename = nameSlug + '_' + filename;
  }

  // Add extension
  filename += '.md';

  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
</script>
