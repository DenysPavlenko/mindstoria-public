# Repository Guidelines

## Project Structure

- `src/app/`: Expo Router routes (file-based navigation, e.g. `src/app/_layout.tsx`, `src/app/(tabs)/`).
- `src/components/`, `src/screens/`, `src/hooks/`, `src/providers/`, `src/services/`, `src/store/`, `src/utils/`: shared UI, features, and app plumbing.
- `src/assets/`: images/fonts and other static assets.
- `src/db/` + `src/drizzle/` + `drizzle.config.ts`: SQLite + Drizzle ORM setup and schema/migrations.
- `patches/`: `patch-package` overrides applied on install.
- `ios/`, `android/`: generated native projects (generally avoid editing unless you know why).

Imports may use the TS path alias `@/*` → `src/*` (see `tsconfig.json`).

## Development Commands

- `npm install`: install deps (runs `postinstall` to apply `patch-package`).
- `npm run start`: start Expo dev server.
- `npm run dev`: start dev server with `APP_VARIANT=development`.
- `npm run ios` / `npm run android`: generate/run native builds locally via `expo run:*`.
- `npm run web`: run in the browser.
- `npm run lint`: run Expo ESLint (`eslint.config.js`).
- `npm run db:generate`: generate Drizzle artifacts.

Helpful checks: `npx tsc -p tsconfig.json --noEmit`.

## Coding Style & Naming

- TypeScript is `strict` with `noUncheckedIndexedAccess`; keep types explicit at boundaries.
- Follow existing formatting (2-space indent, double quotes, trailing commas where present).
- Prefer descriptive names; keep route files in `src/app/` lowercase/kebab-case (as in existing routes).

## Testing

No dedicated test runner is configured yet. Validate changes with:
- `npm run lint` and `npx tsc ...`
- manual smoke tests in Expo (iOS/Android/Web) for affected flows.

## Commits & Pull Requests

- Use Conventional Commits as in history: `feat(scope): ...`, `fix(scope): ...`, `build(scope): ...`.
- PRs: include a short summary, linked issue (if any), and screenshots/screen recordings for UI changes.

## Security & Configuration

- Store secrets in `.env.local`; `.env*` is gitignored—do not commit credentials.
- Treat `credentials/` as sensitive unless explicitly intended for source control.
