# Admin Prime

[English](./README.en-US.md)

以 `Vue 3 + TypeScript + Vite` 建立的後台模板，重點放在可擴充版型、路由/存取流程，以及可重用的後端串接基礎。

## 目前功能

- 版型架構：
  - `AuthLayout`（登入頁，右上主題/語言切換）
  - `DefaultLayout`（toolbar + sidebar + tags view + content + footer）
  - `ErrorLayout`（`403` / `404` 錯誤頁）
- Header 工具：
  - 側欄切換
  - Breadcrumb
  - 全螢幕切換
  - 主題切換（`light / dark / system`）
  - 語言切換（`zh-TW / en-US`）
  - 通知面板
  - 使用者選單（登出）
- Sidebar 行為：
  - 桌面版收合/展開
  - 收合時滑過展開
  - 手機版遮罩抽屜
  - 支援依權限過濾選單（`permissionKey`）
- TagsView + KeepAlive：
  - 追蹤已開頁籤
  - 可關閉頁籤（`Dashboard` 固定）
  - 由頁面元件名稱管理 `KeepAlive include`
- Demo 頁面：
  - `Dashboard`（KPI 卡片 + 折線/柱狀/甜甜圈圖）
  - `UserList`（關鍵字搜尋 + 建立/編輯/刪除彈窗流程）
  - `Login`（email/password + 社群登入 mock 按鈕）
  - 錯誤頁（`403`、`404`）
- API 基礎層：
  - 集中 `axios` instance
  - 請求自動轉 `snake_case`
  - 回應自動轉 `camelCase`
  - 統一 API 錯誤 fallback 對應
- Mock 後端（`MSW`）：
  - `VITE_MOCK=true` 時啟用
  - `.env.example` 預設為 `VITE_MOCK=false`（真實後端模式）
  - 內建 auth / permission / role / user API
- 路由守衛：
  - `bootstrap` / `auth` / `permission` / `progress` / `title`
- 國際化：
  - `en-US`、`zh-TW`
  - login/dashboard/user management/notifications/common 文案已多語化
- 建置附加輸出：
  - bundle 分析檔（`dist/stats.html`、`dist/analyze-report.txt`、`dist/analyze-result.json`）
  - Brotli 壓縮檔（`.br`）

## Demo 登入帳號（Mock）

- 帳號：`admin@gmail.com`
- 密碼：`123456`

## 技術棧

- `Vue 3` + `TypeScript`（`script setup`）
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

## 環境需求

- Node.js `24.11.0`（見 `.nvmrc`）
- `pnpm`

## 快速開始

```bash
pnpm install
cp .env.example .env
pnpm dev
```

開發網址：`http://localhost:5173`（Vite 會自動開啟）

`.env` 已加入 gitignore，只會保留在本機。

若 `public/mockServiceWorker.js` 不存在，執行：

```bash
pnpm msw:init
```

## 環境變數

| 名稱 | 預設值 | 說明 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api/v1` | 共用 axios instance 的 base URL（`src/api/axiosInstance.ts`）。 |
| `VITE_MOCK` | `false` | 啟用瀏覽器端 MSW mock worker（`src/main.ts`）。設為 `true` 可切換為 mock 後端。 |
| `VITE_APP_ENV` | _(空值)_ | 設為 `production` 時，Vite build 會移除 `debugger`（`vite.config.ts`）。 |

### 切換真實後端

可將 `.env` 設為：

```bash
VITE_MOCK=false
VITE_API_BASE_URL=https://your-api.example.com/api/v1
```

### 切換 Mock 後端

可將 `.env` 設為：

```bash
VITE_MOCK=true
VITE_API_BASE_URL=/api/v1
```

## 指令

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

## Mock API Endpoints（MSW）

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/status`
- `GET /api/v1/my/permissions`
- `GET /api/v1/roles`
- `GET /api/v1/users`
- `POST /api/v1/users`
- `PUT /api/v1/users/:id`
- `DELETE /api/v1/users/:id`

## 專案結構

```text
src/
  api/                  # axios instance + auth/users API 模組
  assets/               # 全域樣式與靜態資產
  components/
    layout/             # sidebar / tags view / notification / user menu...
  composables/          # permission / sidebar / toast / dialog helpers
  constants/            # menu 與 permission 常數
  directives/           # v-loading / v-permission
  layouts/              # AuthLayout / DefaultLayout / ErrorLayout
  locales/              # en-US / zh-TW
  mocks/                # MSW browser + handlers
  plugins/              # i18n 與 document-title 同步
  router/               # routes + guards
  stores/               # auth / config / tagsView
  themes/               # PrimeVue preset
  views/                # login / dashboard / user-list / errors
```

## 擴充入口

1. 路由權限與頁面 metadata：`src/router/index.ts`
   - `meta.access`、`meta.keepAlive`、`meta.permissionKey`、`meta.i18nKey`
2. 側欄設定：`src/constants/sidebarMenu.ts`
3. 權限驗證：
   - `src/composables/usePermission.ts`
   - `src/directives/permission.ts`
4. Mock API 行為：`src/mocks/handlers.ts`
5. API 轉換與錯誤處理：`src/api/axiosInstance.ts`
6. Auth 流程：`src/stores/auth.ts`、`src/views/login/index.vue`
7. Tags 快取策略：`src/stores/tagsView.ts`
8. 語系內容：`src/locales/en-US.json`、`src/locales/zh-TW.json`
