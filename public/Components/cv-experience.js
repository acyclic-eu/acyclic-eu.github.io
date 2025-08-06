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
  render: ({ title, company, traits, location, startDate, endDate, employmentType, expTags }) => html`
    <div class="experience"
         data-exp-tags="${expTags}"
         data-end-date="${endDate}">
      <h2>${title} at ${company}</h2>
      <p class="traits">${traits ? html`<em class="traits">${traits}</em>` : ''}  ${expTags ? html` - <em class="tags">${expTags}</em>` : ''}</p>
      <p><strong>Location:</strong> ${location}<br>
      <strong>Period:</strong> ${startDate } - ${endDate} (${employmentType})</p>
      <slot></slot>
    </div>`,
});
