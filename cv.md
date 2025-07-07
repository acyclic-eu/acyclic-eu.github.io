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
</style>

<!-- Collect all unique tags from all descriptions and experiences -->
{% assign all_tags = "" | split: "," %}
{% for exp in site.data.cv.experiences %}
{% if exp.tags %}
{% for tag in exp.tags %}
{% unless all_tags contains tag %}
{% assign all_tags = all_tags | push: tag %}
{% endunless %}
{% endfor %}
{% endif %}
{% for desc in exp.descriptions %}
{% if desc.tags %}
{% for tag in desc.tags %}
{% unless all_tags contains tag %}
{% assign all_tags = all_tags | push: tag %}
{% endunless %}
{% endfor %}
{% endif %}
{% endfor %}
{% endfor %}

<!-- Define the order of tags -->
{% assign ordered_tags = "" | split: "," %}
{% if all_tags contains "Organisation" %}
{% assign ordered_tags = ordered_tags | push: "Organisation" %}
{% endif %}
{% if all_tags contains "Technical" %}
{% assign ordered_tags = ordered_tags | push: "Technical" %}
{% endif %}
{% if all_tags contains "Business" %}
{% assign ordered_tags = ordered_tags | push: "Business" %}
{% endif %}

<h2>Leadership</h2>
<form id="cv-tags-form">
  {% for tag in ordered_tags %}
    <label style="margin-right:1em;"><input type="checkbox" value="{{ tag | uri_escape }}" onchange="filterCV()"> {{ tag }}</label>
  {% endfor %}
  <div style="margin-top:1em;">
    <div style="display:flex; align-items:center; margin-bottom:0.5em;">
      <label for="experience-age" style="margin-right:1em;">Experience Timeframe: <span id="year-depth-value">10</span> years</label>
      <div style="flex-grow:1;">
        <input type="range" id="experience-age" min="0" max="30" value="10" step="1" style="width:100%;" onchange="updateYearDepthValue(this.value); filterCV();" oninput="updateYearDepthValue(this.value);">
        <div style="display:flex; justify-content:space-between; font-size:0.8em;">
          <span>Current only</span>
          <span>All experience</span>
        </div>
      </div>
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

function filterCV() {
  var checked = Array.from(document.querySelectorAll('#cv-tags-form input[type=checkbox]:checked')).map(cb => decodeURIComponent(cb.value).trim());
  var yearDepth = parseInt(document.getElementById('experience-age').value);

  // Calculate cutoff date based on year depth
  var today = new Date();
  var cutoffYear = today.getFullYear() - yearDepth;
  var cutoffDate = new Date(cutoffYear, today.getMonth(), today.getDate());

  // Filter experiences based on their tags and end date
  var experiences = document.querySelectorAll('#cv-content .experience');
  experiences.forEach(function(exp) {
    var expTags = decodeURIComponent(exp.getAttribute('data-exp-tags')).split(',').map(function(tag) { return tag.trim(); });
    var endDateStr = exp.getAttribute('data-end-date');

    // Parse the end date
    var endDate;
    if (endDateStr === "Present") {
      endDate = new Date();
    } else {
      endDate = new Date(endDateStr);
    }

    // Show experience if it passes both tag filter and date filter
    var passesTagFilter = checked.length === 0 || expTags.includes('always') || expTags.some(function(tag) { return checked.includes(tag); });
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
    var tags = decodeURIComponent(li.getAttribute('data-tags')).split(',').map(function(tag) { return tag.trim(); });
    if (tags.includes('always') || tags.some(function(tag) { return checked.includes(tag); })) {
      li.style.display = '';
    } else {
      li.style.display = 'none';
    }
  });
}

// Initialize filtering on page load
window.addEventListener('DOMContentLoaded', function() {
  filterCV();
});
</script>
