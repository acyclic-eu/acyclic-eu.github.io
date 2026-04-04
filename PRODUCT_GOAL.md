# Product Goal

acyclic.eu is Patrik Gustafsson's professional portfolio and blog.

## Vision

A minimal, content-first site that lets visitors quickly understand Patrik's professional experience through the lens of their specific need — software developer, engineering leader, or coach.

## Core Feature: Filterable CV

The CV is the primary product surface. Visitors arrive with a specific role in mind; the filter system surfaces relevant experience immediately.

- Filter by role: **Developer**, **Leader**, **Coach** — driven by tags in [`_data/cv.yml`](_data/cv.yml)
- Filter by time range — slider limits experience depth
- Deep-linkable views: `/cv/?tags=Developer`, `/cv/?tags=Leader`, `/cv/?tags=Coach`
- Markdown export — generates a tailored CV for job applications

## Audience

Recruiters, clients, and collaborators assessing fit for a specific engagement.

## Scope

- Personal portfolio and blog — not a product for other users
- No backend, no auth, no user data
- Three sites share a base: **acyclic.eu**, **howtoknow.eu**, **regin.se** — common infrastructure lives in [`public/css/wwwBase.css`](public/css/wwwBase.css); site-specific overrides in `public/css/justYours.css`
