import { html, define } from "https://cdn.jsdelivr.net/npm/hybrids@9.1.18/src/index.js";

export default define({
  tag: "cv-experience",
  /** @type {string} */
  title: "",
  /** @type {string} */
  tagline: "",
  /** @type {string} */
  company: "",
  /** @type {string} */
  traits: null,
  /** @type {string} */
  location: "",
  startDate: "",
  /** @type {string} */
  endDate: "Present",
  /** @type {string} */
  employmentType: "Employed",
  /** @type {string} */
  expTags: "", // comma-separated string
  /** @type {array} */
  descriptions: {
    get: (host) => {
      // Hybrids will call the getter even if the attribute is not set, so handle undefined/null/empty string
      const val = host._descriptions;
      if (Array.isArray(val)) return val;
      if (typeof val === 'string' && val.trim().startsWith('[')) {
        try {
          return JSON.parse(val);
        } catch (e) {
          return [val.trim()];
        }
      }
      // If val is a non-empty string but not valid JSON, treat as single description
      if (typeof val === 'string' && val.trim()) {
        return [val.trim()];
      }
      return [];
    },
    set: (host, value) => {
      host._descriptions = value;
    },
    value: []
  },
  render: ({ title, tagline, company, traits, location, startDate, endDate, employmentType, expTags, descriptions }) => {
    return html`
      <div class="experience"
           data-exp-tags="${expTags}"
           data-end-date="${endDate}">
        ${tagline ? html`<h2 class="tagline">${tagline}</h2>` : ''}
        <h3 class="job-title">${title} at ${company}</h3>
        <p class="traits">${traits ? html`<em class="traits">${traits}</em>` : ''}  ${expTags ? html` - <em class="tags">${expTags}</em>` : ''}</p>
        <p><strong>Location:</strong> ${location}<br>
        <strong>Period:</strong> ${startDate } - ${endDate} (${employmentType})</p>
        ${descriptions.length > 0 ? html`<ul>${descriptions.map(desc => html`<li>${desc}</li>`)}</ul>` : ''}
        <slot></slot>
      </div>`;
  },
});
