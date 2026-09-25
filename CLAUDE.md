# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Bewerbungstracker** – a personal job-application tracker, built as a learning project for Vue 3 (Composition API), Pinia, Vue Router, REST APIs and Vitest. Single user (the author). `PLAN.md` at the repo root is the design document *and* the running project diary (decision log, learning log, weekly checklist). It is written in Vietnamese with German domain terms; code and identifiers are in English.

Repo layout:

- `client/` – the Vue app (scaffolded with `create-vue`). **All npm commands run from here.**
- `server/` – does not exist yet; planned Phase 2 Express + MariaDB backend.
- `Skript/` – empty placeholder.

## Commands (run inside `client/`)

```sh
npm install
npm run dev          # Vite dev server with HMR
npm run build        # production build to dist/
npm run preview      # serve the production build
npm run test:unit    # Vitest in watch mode
npm run lint         # oxlint --fix, then eslint --fix (via run-s "lint:*")
npm run format       # prettier --write src/
```

Single test file / single test:

```sh
npx vitest run src/components/__tests__/HelloWorld.spec.js
npx vitest run -t "renders properly"
```

Node `^22.18.0 || >=24.12.0` is required (see `engines` in `client/package.json`).

## Architecture and conventions

- **Vue 3 with `<script setup>`** in every SFC. Plain JavaScript for now; TypeScript is planned for Phase 2 (a `src/types/` folder is reserved for it).
- **Pinia stores use the setup-store style** (`defineStore('name', () => { ... })` returning refs/computeds/functions), not the options object. `src/stores/counter.js` is the scaffold example of this.
- **Vue Router** uses `createWebHistory`; non-home views are lazy-loaded with `() => import(...)`. Routes live in `src/router/index.js`.
- **`@` alias resolves to `client/src`** (configured in both `vite.config.js` and `jsconfig.json`).
- **Tests**: Vitest with `jsdom` environment and `@vue/test-utils`; `vitest.config.js` merges the Vite config. Test files go in `src/**/__tests__/*.spec.js` – the ESLint Vitest plugin is scoped to exactly that glob. `e2e/**` is excluded from Vitest.
- **Linting is two layers**: oxlint runs first (plugins eslint/unicorn/oxc/vue/vitest, `correctness` category as error), then ESLint flat config (`@eslint/js` recommended + `eslint-plugin-vue` `flat/essential`) with the oxlint-covered rules disabled via `eslint-plugin-oxlint`. Prettier is the formatter: no semicolons, single quotes, print width 100.
- **Styling**: plain CSS with `<style scoped>`; global tokens live in `src/assets/base.css` / `main.css`. No CSS framework.

## Data model and product scope (from PLAN.md)

- MVP persists to **`localStorage` only** – there is no backend yet. Phase 2 adds Express + MariaDB behind a Vite dev proxy `/api` → `http://localhost:3000`, and a REST API under `/api/applications` (GET/POST/PUT/PATCH `/status`/DELETE).
- Core entity is an **application**. Fields are decided: `id`, `company`, `position`, `link`, `ort`, `gehaltMin`, `gehaltMax`, `status`, `datum`, `notizen`, `createdAt`, `updatedAt`.
- **Status values are German enum strings**: `gespeichert`, `beworben`, `interview`, `zusage`, `absage`. Use these exact values.
- Planned routes: `/`, `/applications/new`, `/applications/:id`, `/applications/:id/edit`. Planned components: `ApplicationList`, `ApplicationForm`, `FilterBar`, `StatusBadge`.
- Deployment target for the frontend is Netlify (static).

The scaffold components (`HelloWorld`, `TheWelcome`, `WelcomeItem`, `icons/`) are `create-vue` leftovers and are meant to be replaced as the real UI is built.

## Working with PLAN.md

PLAN.md is meant to be kept up to date during development. When a technical decision is made or a milestone is finished, update the relevant section (checklist items `- [ ]` → `- [x]`, section 13 decision log, section 14 learning log) rather than leaving it stale. Because this is a learning project, prefer explaining *why* a Vue/Pinia pattern is used over silently applying it.

## Workflow rules
- Small steps: only touch files the current task needs. Ask before adding npm packages. Never use sudo with npm.
- Before saying "done": run `npm run lint` and `npm run build` in client/ (and `npx vitest run` if tests exist – NOT `npm run test:unit`, it is watch mode). Show the output.
- IMPORTANT: After every task, append a section to LERNEN.md (in Vietnamese): which Vue/JS concepts were used, why, in which file, with links to official docs (vuejs.org, pinia.vuejs.org, router.vuejs.org, MDN).
- Commit messages: Conventional Commits (feat:, fix:, chore:, docs:, test:, style:). One commit per task.
