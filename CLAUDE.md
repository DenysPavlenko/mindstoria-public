# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start with APP_VARIANT=development
npm run start        # Start without variant (production config)
npm run lint         # ESLint via expo preset

# Database
npm run db:generate  # Generate Drizzle migrations after schema changes

# Native builds (EAS)
npm run build:ios:dev       # iOS development build
npm run build:ios:prod      # iOS production build
npm run build:android:dev   # Android development build
npm run build:android:prod  # Android production build

# OTA updates
npm run update:prev  # Push to preview channel
npm run update:prod  # Push to production channel
```

No test suite is configured.

## Architecture

### Data Layer: Two Persistence Mechanisms

The app uses **two separate storage systems** that must be kept in sync:

1. **SQLite (via Drizzle ORM)** — stores actual log records: `logs`, `sleep_logs`, `med_logs`, `cbt_logs`. Schema is in `src/db/schema.ts`. Migrations are auto-generated in `src/drizzle/` and applied on app startup in `_layout.tsx` via `useMigrations`. When changing the schema, always run `npm run db:generate`. SQLite is encrypted on iOS (SQLCipher).

2. **Redux + MMKV** — stores everything else: definitions (emotions, impacts, medications), settings, UI state, and derived/aggregated data (sentimentFrequency, logMetrics). `redux-persist` serializes Redux state to MMKV. Only some slices are persisted — see `src/store/store.ts` for which.

Important: log records live in SQLite but their aggregated frequency counts (how often each emotion/impact appears) are tracked separately in the `sentimentFrequency` Redux slice. These must be updated together when creating/deleting logs.

### State Management

Redux slices are in `src/store/slices/`, each with `slice.ts` and `selectors.ts`. Use typed hooks from `src/store/hooks.ts` (`useAppSelector`, `useAppDispatch`). The `draftLog` slice holds in-progress log editing state.

### Routing

Expo Router with file-based routing. `src/app/(tabs)/` contains the three main tabs (home, cbt-logs, settings). Full-screen flows (log creation, managers) are stack screens at the root `src/app/` level. The app guards `start` (onboarding) vs `(tabs)` using `Stack.Protected` based on the `selectStartScreenShow` selector.

### Provider Stack

Root layout wraps the app in this order (outermost first):
`Redux Provider → PersistGate → RevenueCatProvider → ThemeProvider → AppContent`

`AppContent` initializes: i18n, Drizzle migrations, fonts, analytics (Mixpanel), and Drizzle Studio (dev tool). Splash screen stays visible until all are ready.

### Theming

`ThemeProvider` (`src/providers/`) exposes `useTheme()` which returns `{ theme, isLoading }`. The theme object follows Material Design 3 color tokens (see `TColorsTheme` in `src/theme/theme.ts`). Use `theme.colors.*` for all color values rather than hardcoding. `withAlpha()` utility handles opacity variants.

### Localization

i18n via i18next with English (`en`) and Ukrainian (`uk`) locales in `src/i18n/locales/`. Always add keys to both locale files when adding new UI text.

### App Variants

Three variants controlled by `APP_VARIANT` env var: `development` (bundle id suffix `.dev`), `preview` (suffix `.preview`), and production (no suffix). Variant is embedded in `app.config.ts` and accessible at runtime via `Constants.expoConfig.extra.APP_VARIANT`.

### Analytics

Analytics events are tracked via Mixpanel (`src/utils/analytics.ts`). Track events for all significant user actions. User profile properties are updated on app load in `_layout.tsx`.

## Conventions

- TypeScript types are prefixed with `T` (e.g., `TLog`, `TSleepLog`)
- Path alias `@/` maps to `src/`
- `dayjs` is used for all date handling; plugins loaded in `_layout.tsx`: `utc`, `isoWeek`, `isSameOrAfter`, `isSameOrBefore`
- React Compiler and React Native New Architecture are both enabled — avoid patterns that break with these (e.g., mutating refs during render)
