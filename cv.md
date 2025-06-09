---
layout: default
title: CV
permalink: /cv/
---

<h1>Curriculum Vitae</h1>

{% assign exps = site.data.cv.experiences %}

{% for exp in exps %}
  <h2>{{ exp.title }} at {{ exp.company }}</h2>
  <p><strong>Location:</strong> {{ exp.location }}<br>
     <strong>Period:</strong> {{ exp.period }}</p>
  <ul>
    {% for desc in exp.descriptions %}
      {% if desc.tags == nil or desc.tags == empty %}
        <li>{{ desc.text }}</li>
      {% endif %}
    {% endfor %}
  </ul>
{% endfor %}
