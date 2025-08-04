import { html, define } from "https://cdn.jsdelivr.net/npm/hybrids@9.1.18/src/index.js";

function updateValue(host, event) {
  host.value = parseInt(event.target.value);

  // Dispatch a standard change event
  host.dispatchEvent(new Event('change', {
    bubbles: true,
    composed: true
  }));
}

export default define({
  tag: "time-filter",
  /** @type {number} */
  value: 10,
  /** @type {number} */
  min: 0,
  /** @type {number} */
  max: 20,
  /** @type {string} */
  label: "Experience Timeframe",
  /** @type {string} */
  minLabel: "Current only",
  /** @type {string} */
  maxLabel: "All experience",
  render: ({ value, min, max, label, minLabel, maxLabel }) => html`
    <style>
      :host {
        display: block;
        margin-top: 1em;
        margin-bottom: 1em;
        --slider-track-color: var(--button-bg, #f0f0f0);
        --slider-thumb-color: var(--secondary, #4f46e5);
        --slider-thumb-hover-color: var(--secondary, #6366f1);
      }

      .filter-container {
        display: flex;
        flex-direction: column;
        width: 100%;
      }

      .filter-header {
        display: flex;
        align-items: center;
        margin-bottom: 0.5em;
      }

      .filter-label {
        margin-right: 1em;
      }

      .value-display {
        font-weight: bold;
      }

      .slider-container {
        flex-grow: 1;
        width: 100%;
      }

      input[type="range"] {
        width: 100%;
        height: 8px;
        -webkit-appearance: none;
        appearance: none;
        background: var(--slider-track-color);
        border-radius: 4px;
        outline: none;
      }

      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: var(--slider-thumb-color);
        cursor: pointer;
        transition: background 0.2s;
      }

      input[type="range"]::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: var(--slider-thumb-color);
        cursor: pointer;
        transition: background 0.2s;
        border: none;
      }

      input[type="range"]::-webkit-slider-thumb:hover {
        background: var(--slider-thumb-hover-color);
      }

      input[type="range"]::-moz-range-thumb:hover {
        background: var(--slider-thumb-hover-color);
      }

      .slider-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.8em;
        margin-top: 0.5em;
      }
    </style>

    <div class="filter-container">
      <div class="filter-header">
        <label class="filter-label">${label}: <span class="value-display">${value}</span> years</label>
      </div>
      <div class="slider-container">
        <input
          type="range"
          min="${min}"
          max="${max}"
          value="${value}"
          step="1"
          oninput="${updateValue}"
        >
        <div class="slider-labels">
          <span>${minLabel}</span>
          <span>${maxLabel} (${max} years)</span>
        </div>
      </div>
    </div>
  `
});
