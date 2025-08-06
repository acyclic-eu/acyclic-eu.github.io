import { html, define } from "https://cdn.jsdelivr.net/npm/hybrids@9.1.18/src/index.js";

export default define({
  tag: "cv-experience",
  /** @type {string} */
  title: "",
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
          return [];
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
  render: ({ title, company, traits, location, startDate, endDate, employmentType, expTags, descriptions }) => {
    // Defensive: always treat descriptions as an array
    let descArr = [];
    if (Array.isArray(descriptions)) {
      descArr = descriptions;
    } else if (typeof descriptions === 'string' && descriptions.trim()) {
      try {
        descArr = JSON.parse(descriptions);
      } catch (e) {
        descArr = [descriptions.trim()];
      }
    } else if (descriptions != null) {
      descArr = [String(descriptions)];
    }
    return html`
      <div class="experience"
           data-exp-tags="${expTags}"
           data-end-date="${endDate}">
        <h2>${title} at ${company}</h2>
        <p class="traits">${traits ? html`<em class="traits">${traits}</em>` : ''}  ${expTags ? html` - <em class="tags">${expTags}</em>` : ''}</p>
        <p><strong>Location:</strong> ${location}<br>
        <strong>Period:</strong> ${startDate } - ${endDate} (${employmentType})</p>
        ${Array.isArray(descArr) && descArr.length > 0 ? html`<ul>${descArr.map(desc => html`<li>${desc}</li>`)}</ul>` : ''}
        <slot></slot>
      </div>`;
  },
});
