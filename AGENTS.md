# Agent Guidelines — acyclic.eu

## Goals and Principles

- [Product Goal](PRODUCT_GOAL.md)
- [Design Principles](_posts/2025-06-09-DESIGN_PRINCIPLES.md)

## Stack

| Layer | Technology |
|---|---|
| Static site | [Jekyll](https://jekyllrb.com) on GitHub Pages |
| Web components | [Hybrids 9.1.18](https://hybrids.js.org) via jsDelivr CDN |
| Custom components | [`public/Components/`](public/Components/) (atomic, self-contained Hybrids web components) |
| Component testing | [`public/Components/dynamic-tester.html`](public/Components/dynamic-tester.html) auto-discovers and tests all components |
| CV data | [`_data/cv.yml`](_data/cv.yml) → Jekyll generates [`/cv/cv.json`](cv/cv.json) |
| CV logic | [`public/js/cv-filter.js`](public/js/cv-filter.js) (drives filterable CV UI) |
| CSS cascade | `poole.css` → `lanyon.css` → `wwwBase.css` → `justYours.css` |

**All UI logic is client-side only. No backend, no user data, no authentication.**

## Conventions

- Atomic commits, one concern per PR
- Branch from `main`; name branches `fix/`, `refactor/`, `docs/`, `feat/`
- Author: Patrik Gustafsson `<patrik@acyclic.eu>`
- No AI attribution in commits or PRs
- All UI features are implemented as atomic, self-contained Hybrids web components in `public/Components/`. When adding a new component, update `dynamic-tester.html` to include it for auto-discovery and testing.
- The filterable CV is the core product surface. Main files: `public/js/cv-filter.js`, `public/Components/`, `_data/cv.yml`.
