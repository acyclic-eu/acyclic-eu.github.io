import { html, define } from "https://cdn.jsdelivr.net/npm/hybrids@9.1.18/src/index.js";

function increaseCount(host) {
  host.count += 1;
}

export default define({
  tag: "simple-counter",
  /** @type {number} */
  count: 0,
  render: ({ count }) => html`
    <button onclick="${increaseCount}">
      Count: ${count}
    </button>
  `,
});
