# FIRE
## 專案簡介
FIRE 是一個專為投資者設計的資產管理系統，
核心目標是：

- 精準記錄買賣交易
- 自動計算持倉成本
- 動態追蹤未實現與已實現損益
- 提供投資儀錶板視覺化分析

本專案採 前後端分離架構，
強調資料模型設計、可維護性與擴充彈性。

## 系統架構
```bash
Frontend (Vue3 + Vite)
        ↓
Nginx Reverse Proxy
        ↓
Backend API (Node.js + Express)
        ↓
PostgreSQL
```

## 架構特點
- JWT + Refresh Token 驗證機制
- Google OAuth 登入
- 前後端分離部署
- Nginx 解決跨網域 Cookie 問題
- 模組化 API 設計

## Tech Stack
### Frontend
- Vue 3 (Composition API)
- TypeScript
- Vite
- UnoCSS
- Naive UI
- Vue Router
- Pinia
- Axios
### Backend 
Node.js + Express + PostgreSQL  
JWT-based authentication (Access + Refresh Token)

## 專案結構 (待確認)
### Frontend
```bash
src/
├── components/     # 共用元件
├── views/          # 頁面
├── stores/         # Pinia 狀態管理
├── api/            # API 封裝
├── router/         # 路由設定
├── plugins/        # 第三方插件
├── types/          # 全域型別
```

## 核心功能
### 1.交易記錄
- 新增買入紀錄
- 新增賣出紀錄
- 依「應收付 + 實現損益」推算實際賣出部位
### 2.持倉成本計算（Lot 機制）
- 每筆交易與持倉對應
- 動態更新剩餘部位成本
- 支援部分賣出
### 3.投資儀錶板
- 當前總資產
- 已實現損益
- 一年內趨勢圖

## 本地開發環境
### Frontend
```bash
npm install
npm run dev
```

## 設計理念
- 可維護性優先、避免技術債
- 明確資料流設計
- 擴充性高(長期版本迭代)

## 未來規劃
- 美化網站、提升使用者體驗 
- 使用者可建立追蹤清單，紀錄買進策略與進場條件
- 導入AI，根據買賣紀錄給出操作評價以及計算該檔持股效益比
