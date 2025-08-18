# Fomos

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# 專案技術棧（Tech Stack）

本專案採用現代化 Vue 前端開發技術，架構簡潔、維護彈性高，適合中大型 SPA／後台管理系統。

## 主要技術

- **Vue 3**  
  前端主力框架，採用 Composition API，實現模組化、響應式開發。
- **Vite**  
  次世代前端建構工具，啟動快、打包效能高，原生支援 TypeScript。
- **TypeScript**  
  強型別語言，提升專案可維護性、減少運行期 bug。
- **UnoCSS**  
  原子化 CSS 引擎，支援 on-demand 註冊 class，結合 iconify 實現高度自定義樣式與圖示。
- **Naive UI**  
  輕量現代 Vue 3 UI 元件庫，支援 TypeScript、主題切換、豐富的表單與資料展示元件，客製化彈性高。
- **Vue Router**  
  路由管理，支援多頁、動態路由配置。
- **Pinia**  
  Vue 官方推薦狀態管理方案，輕量、型別友善，適合中大型專案的全局資料流管理。
- **ESLint**  
  程式碼品質檢查工具，配合 Prettier 實現團隊統一風格、減少語法錯誤。
- **Prettier**  
  程式碼自動格式化工具，保證程式碼排版一致，協作效率高。

## 設計理念

- **高可維護性**：元件、狀態、API、樣式各自模組化，易於維護與擴充。
- **按需註冊/引入**：UI 元件、CSS、狀態資料、icon，全部按需管理，提升效能。
- **自定義彈性高**：UnoCSS 結合 Naive UI，樣式與 UI 完全可自訂，方便客製化設計稿對應。
- **團隊友善**：ESLint + Prettier 強制統一程式碼規範，新人 onboarding 零門檻。

## 資料夾建議規劃（初步建議）

- `/src/components`：共用元件
- `/src/views`：頁面組件
- `/src/plugins`：第三方/自訂插件（如 naive.ts）
- `/src/stores`：Pinia 狀態管理
- `/src/router`：Vue Router 設定
- `/src/assets`：全域 CSS/UnoCSS 設定及靜態資源（圖片、svg 等）
- `/src/api`：API 請求封裝
- `/src/types`：全域型別定義

---
