import { html, define } from "https://cdn.jsdelivr.net/npm/hybrids@9.1.18/src/index.js";

function toggleState(host) {
  host.checked = !host.checked;

  // Dispatch a standard change event
  host.dispatchEvent(new Event('change', {
    bubbles: true,
    composed: true
  }));
}

export default define({
  tag: "tag-toggle",
  /** @type {string} */
  name: "name",
  /** @type {string} */
  description: "toggle this tag",
  /** @type {boolean} */
  checked: false,
  render: ({ name, description, checked }) => html`
    <style>
      :host {
        display: inline-block;
        margin-right: 1.5em;
        margin-bottom: 0.5em;
        position: relative;
      }

      .toggle-container {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .toggle-label {
        padding: 0.3em 0.5em;
        border-radius: 3px;
        transition: all 0.2s ease;
      }

      .toggle-container.checked .toggle-label {
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

      :host(:hover) .filter-description {
        display: block;
      }
    </style>

    <div class="toggle-container ${checked ? 'checked' : ''}" onclick="${toggleState}">
      <span class="toggle-label">${name}</span>
    </div>
    <div class="filter-description">${description}</div>
  `,
});
