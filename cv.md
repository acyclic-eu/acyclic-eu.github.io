---
layout: default
title: CV
permalink: /cv/
---

<h1>Curriculum Vitae</h1>

<!-- Collect all unique tags from all descriptions -->
{% assign all_tags = "" | split: "," %}
{% for exp in site.data.cv.experiences %}
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
{% if all_tags contains "Organizational" %}
  {% assign ordered_tags = ordered_tags | push: "Organizational" %}
{% endif %}
{% if all_tags contains "Technological" %}
  {% assign ordered_tags = ordered_tags | push: "Technological" %}
{% endif %}
{% if all_tags contains "Product" %}
  {% assign ordered_tags = ordered_tags | push: "Product" %}
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
  <h2>{{ exp.title }} at {{ exp.company }}</h2>
  <p><strong>Location:</strong> {{ exp.location }}<br>
     <strong>Period:</strong> {{ exp.period }}</p>
  <ul>
    {% for desc in exp.descriptions %}
      {% if desc.tags == nil or desc.tags == empty %}
        <li data-tags="always">{{ desc.text }}</li>
      {% else %}
        <li data-tags="{{ desc.tags | join: ',' | uri_escape }}" style="display:none;">{{ desc.text }}</li>
      {% endif %}
    {% endfor %}
  </ul>
{% endfor %}
</div>

<script>
function filterCV() {
  var checked = Array.from(document.querySelectorAll('#cv-tags-form input[type=checkbox]:checked')).map(cb => decodeURIComponent(cb.value).trim());
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
