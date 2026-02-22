# Admin Prime

[繁體中文](./README.zh-TW.md)

Admin dashboard starter built with `Vue 3 + TypeScript + Vite`, focused on scalable layout architecture, route/access flow, and reusable backend integration patterns.

## Current Features

- Layouts:
  - `AuthLayout` (login page with top-right theme/language switch)
  - `DefaultLayout` (toolbar + sidebar + tags view + main content + footer)
  - `ErrorLayout` (`403` / `404` pages)
- Header utilities:
  - Sidebar toggle
  - Breadcrumb
  - Fullscreen switch
  - Theme switch (`light / dark / system`)
  - Locale switch (`zh-TW / en-US`)
  - Notification popover
  - User menu (logout)
- Sidebar behavior:
  - Desktop collapsed/expanded mode
  - Hover-expand when collapsed
  - Mobile overlay drawer
  - Permission-aware menu filtering support (`permissionKey`)
- TagsView + KeepAlive:
  - Track visited pages
  - Closable tabs (`Dashboard` is pinned)
  - `KeepAlive` include list managed by route component name
- Demo pages:
  - `Dashboard` (KPI cards + line/bar/doughnut charts)
  - `UserList` (keyword search + create/edit/delete dialog flow)
  - `Login` (email/password + social login mock buttons)
  - Error pages (`403`, `404`)
- API foundation:
  - Central `axios` instance
  - Request keys auto-converted to `snake_case`
  - Response keys auto-converted to `camelCase`
  - Unified API error fallback mapping
- Mock backend (`MSW`):
  - Enabled when `VITE_MOCK=true`
  - `.env.example` defaults to `VITE_MOCK=false` (real-backend mode)
  - Includes auth / permission / role / user endpoints
- Route guards:
  - `bootstrap` / `auth` / `permission` / `progress` / `title`
- i18n:
  - `en-US`, `zh-TW`
  - UI texts for login/dashboard/user management/notifications/common are localized
- Build extras:
  - Bundle analyzer output (`dist/stats.html`, `dist/analyze-report.txt`, `dist/analyze-result.json`)
  - Brotli compression output (`.br`)

## Demo Login Account (Mock)

- Account: `admin@gmail.com`
- Password: `123456`

## Tech Stack

- `Vue 3` + `TypeScript` (`script setup`)
- `Vite 7`
- `Vue Router 5`
- `Pinia` + `pinia-plugin-persistedstate`
- `Vue I18n`
- `PrimeVue 4` + `primeicons`
- `Tailwind CSS 4` + `tailwindcss-primeui`
- `Chart.js`
- `Axios`
- `MSW`
- `Zod` + `@primevue/forms`

## Requirements

- Node.js `24.11.0` (see `.nvmrc`)
- `pnpm`

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Dev URL: `http://localhost:5173` (auto-open by Vite)

`.env` is gitignored and stays local only.

If `public/mockServiceWorker.js` is missing, run:

```bash
pnpm msw:init
```

## Environment Variables

| Name | Default | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api/v1` | Base URL for the shared axios instance (`src/api/axiosInstance.ts`). |
| `VITE_MOCK` | `false` | Enables browser-side MSW mock worker (`src/main.ts`). Set `true` to use mock backend. |
| `VITE_APP_ENV` | _(empty)_ | If set to `production`, Vite build drops `debugger` statements (`vite.config.ts`). |

### Real Backend Mode

Set `.env` like this:

```bash
VITE_MOCK=false
VITE_API_BASE_URL=https://your-api.example.com/api/v1
```

### Mock Backend Mode

Set `.env` like this:

```bash
VITE_MOCK=true
VITE_API_BASE_URL=/api/v1
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm type-check
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm msw:init
```

## Mock API Endpoints (MSW)

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/status`
- `GET /api/v1/my/permissions`
- `GET /api/v1/roles`
- `GET /api/v1/users`
- `POST /api/v1/users`
- `PUT /api/v1/users/:id`
- `DELETE /api/v1/users/:id`

## Project Structure

```text
src/
  api/                  # axios instance + auth/users API modules
  assets/               # global styles and static assets
  components/
    layout/             # sidebar / tags view / notification / user menu...
  composables/          # permission / sidebar / toast / dialog helpers
  constants/            # menu and permission constants
  directives/           # v-loading / v-permission
  layouts/              # AuthLayout / DefaultLayout / ErrorLayout
  locales/              # en-US / zh-TW
  mocks/                # MSW browser + handlers
  plugins/              # i18n and document-title sync
  router/               # routes + guards
  stores/               # auth / config / tagsView
  themes/               # PrimeVue preset
  views/                # login / dashboard / user-list / errors
```

## Extension Entry Points

1. Route access and page metadata: `src/router/index.ts`
   - `meta.access`, `meta.keepAlive`, `meta.permissionKey`, `meta.i18nKey`
2. Sidebar configuration: `src/constants/sidebarMenu.ts`
3. Permission checks:
   - `src/composables/usePermission.ts`
   - `src/directives/permission.ts`
4. Mock API behavior: `src/mocks/handlers.ts`
5. API conversion + error handling: `src/api/axiosInstance.ts`
6. Auth flow: `src/stores/auth.ts`, `src/views/login/index.vue`
7. Tags cache strategy: `src/stores/tagsView.ts`
8. Locale messages: `src/locales/en-US.json`, `src/locales/zh-TW.json`
