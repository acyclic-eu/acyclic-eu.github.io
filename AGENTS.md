# Agent Guidelines — acyclic.eu

## Goals and Principles

- [Product Goal](PRODUCT_GOAL.md)
- [Design Principles](_posts/2025-06-09-DESIGN_PRINCIPLES.md)

## Stack

| Layer | Technology |
|---|---|
| Static site | [Jekyll](https://jekyllrb.com) on GitHub Pages |
| Web components | [Hybrids 9.1.18](https://hybrids.js.org) via jsDelivr CDN |
| CV data | [`_data/cv.yml`](_data/cv.yml) → Jekyll generates [`/cv/cv.json`](cv/cv.json) |
| CV logic | [`public/js/cv-filter.js`](public/js/cv-filter.js) |
| Components | [`public/Components/`](public/Components/) |
| CSS cascade | `poole.css` → `lanyon.css` → `wwwBase.css` → `justYours.css` |

## Conventions

- Atomic commits, one concern per PR
- Branch from `main`; name branches `fix/`, `refactor/`, `docs/`, `feat/`
- Author: Patrik Gustafsson `<patrik@acyclic.eu>`
- No AI attribution in commits or PRs
- `wwwBase.css` is shared across acyclic.eu, howtoknow.eu, regin.se — only add styles that apply to all three
- Site-specific styles go in `justYours.css`
