---
layout: default
title: CV
permalink: /cv/
---

<h1>Curriculum Vitae</h1>

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
</form>

<div id="cv-content">
{% assign exps = site.data.cv.experiences %}
{% for exp in exps %}
  {% if exp.tags %}
    <div class="experience" data-exp-tags="{{ exp.tags | join: ',' | uri_escape }}" style="display:none;">
  {% else %}
    <div class="experience" data-exp-tags="always">
  {% endif %}
    <h2>{{ exp.title }} at {{ exp.company }}</h2>
    <p><strong>Location:</strong> {{ exp.location | default: "N/A" }}<br>
    <strong>Period:</strong> {{ exp.start_date | default: "N/A" }} - {{ exp.end_date | default: "Present" }}
    </p>
    <ul>
      {% for desc in exp.descriptions %}
        {% if desc.tags == nil or desc.tags == empty %}
          <li data-tags="always" class="tag-always">{{ desc.text | escape }}</li>
        {% else %}
          <li data-tags="{{ desc.tags | join: ',' | uri_escape }}" style="display:none;">{{ desc.text }}</li>
        {% endif %}
      {% endfor %}
    </ul>
  </div>
{% endfor %}
</div>

<script>
function filterCV() {
  var checked = Array.from(document.querySelectorAll('#cv-tags-form input[type=checkbox]:checked')).map(cb => decodeURIComponent(cb.value).trim());

  // Filter experiences based on their tags
  var experiences = document.querySelectorAll('#cv-content .experience');
  experiences.forEach(exp => {
    var expTags = decodeURIComponent(exp.getAttribute('data-exp-tags')).split(',').map(tag => tag.trim());
    if (checked.length === 0 || expTags.includes('always') || expTags.some(tag => checked.includes(tag))) {
      exp.style.display = '';
    } else {
      exp.style.display = 'none';
    }
  });

  // Filter descriptions based on their tags
  var lis = document.querySelectorAll('#cv-content li');
  lis.forEach(li => {
    var tags = decodeURIComponent(li.getAttribute('data-tags')).split(',').map(tag => tag.trim());
    if (tags.includes('always') || tags.some(tag => checked.includes(tag))) {
      li.style.display = '';
    } else {
      li.style.display = 'none';
    }
  });
}
</script>
