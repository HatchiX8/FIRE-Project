<template>
  <section class="text-textColor px-4 py-6">
    <h2 class="mb-4">FIRE 投資記帳特色</h2>

    <!-- 橫向卡片滑動 -->
    <n-carousel draggable autoplay :show-dots="false" class="h-66 rounded-2xl">
      <n-carousel-item>
        <n-card title="完整記錄每一筆操作" size="small">
          <template #cover>
            <i class="i-clarity:notebook-line text-6 text-primary"></i>
          </template>
          <p class="text-textSecondary text-sm leading-tight">你的投資紀錄本，回頭看得見當下思路</p>
          <ul class="my-4 space-y-2">
            <li class="flex items-start gap-2">
              <i class="i-mdi:check-circle-outline text-5 text-primary mt-0.5"></i>
              <p class="text-sm">買/賣價格、股數、損益、備註一次到位</p>
            </li>
            <li class="flex items-start gap-2">
              <i class="i-mdi:lightning-bolt-outline text-5 text-primary mt-0.5"></i>
              <p class="text-sm">一鍵建立歷史成交，快速補帳</p>
            </li>
            <li class="flex items-start gap-2">
              <i class="i-mdi:pencil-outline text-5 text-primary mt-0.5"></i>
              <p class="text-sm">隨時修正錯誤輸入，維持資料準確</p>
            </li>
          </ul>
          <p class="text-textSecondary mb-3 text-xs">
            主升段追進或回測驗證，這裡都是最誠實的紀錄本。
          </p>
          <button
            class="bg-primary/20 text-primary font-600 hover:bg-primary/30 h-11 w-full rounded-xl transition"
          >
            立即體驗日誌 →
          </button>
        </n-card>
      </n-carousel-item>

      <n-carousel-item>
        <n-card title="水位配置與損益趨勢" size="small">
          <template #cover>
            <i class="i-clarity:notebook-line text-6 text-primary"></i>
          </template>
          <p class="text-textSecondary text-sm leading-tight">看得懂自己做了什麼，決策更踏實</p>
          <ul class="my-4 space-y-2">
            <li class="flex items-start gap-2">
              <i class="i-mdi:chart-pie-outline text-5 text-primary mt-0.5"></i>
              <p class="text-sm">自動計算現金比例與股票配置</p>
            </li>
            <li class="flex items-start gap-2">
              <i class="i-mdi:cash-sync text-5 text-primary mt-0.5"></i>
              <p class="text-sm">即時未實現損益（依當日市價）</p>
            </li>
            <li class="flex items-start gap-2">
              <i class="i-mdi:timeline-clock-outline text-5 text-primary mt-0.5"></i>
              <p class="text-sm">近一年趨勢圖，追蹤表現變化</p>
            </li>
          </ul>

          <p class="text-textSecondary mb-3 text-xs">成績不只是數字，更是策略修正的依據。</p>

          <button
            class="bg-primary font-700 h-11 w-full rounded-xl text-base text-black transition hover:opacity-90"
          >
            查看我的趨勢 →
          </button>
        </n-card>
      </n-carousel-item>
      <n-carousel-item>
        <n-card title="進階功能，系統化投資" size="small">
          <template #cover>
            <i class="i-clarity:notebook-line text-6 text-primary"></i>
          </template>
          <p class="text-textSecondary text-sm leading-tight">不只記錄，還能驅動流程</p>

          <ul class="my-4 space-y-2">
            <li class="flex items-start gap-2">
              <i class="i-mdi:star-plus-outline text-5 text-primary mt-0.5"></i>
              <p class="text-sm">追蹤清單＋自訂進場策略與條件</p>
            </li>
            <li class="flex items-start gap-2">
              <i class="i-mdi:bookmark-multiple-outline text-5 text-primary mt-0.5"></i>
              <p class="text-sm">收藏關鍵賣出操作，累積經典範例</p>
            </li>
            <li class="flex items-start gap-2">
              <i class="i-mdi:robot-happy-outline text-5 text-primary mt-0.5"></i>
              <p class="text-sm">AI 每週彙整操作摘要與回顧（規劃中）</p>
            </li>
          </ul>

          <p class="text-textSecondary mb-3 text-xs">
            長期修行，有系統才走得遠，我們是你的數據夥伴。
          </p>

          <button
            class="border-primary text-primary font-700 hover:bg-primary/10 h-11 w-full rounded-xl border transition"
          >
            解鎖進階功能 →
          </button>
        </n-card>
      </n-carousel-item>
    </n-carousel>

    <!-- ✅ 下方輕量優勢列（補畫面，不喧賓奪主） -->

    <section class="mt-8 grid grid-cols-2 gap-3">
      <div
        class="bg-backgroundSurface flex items-center gap-2 rounded-xl border border-white/5 p-3"
      >
        <i class="i-mdi:shield-check-outline text-6 text-primary"></i>
        <div>
          <p class="font-600 text-sm">資料安全</p>
          <p class="text-textSecondary text-xs">支援匯出與刪除</p>
        </div>
      </div>
      <div
        class="bg-backgroundSurface flex items-center gap-2 rounded-xl border border-white/5 p-3"
      >
        <i class="i-mdi:file-export-outline text-6 text-primary"></i>
        <div>
          <p class="font-600 text-sm">CSV 匯出</p>
          <p class="text-textSecondary text-xs">一鍵備份你的紀錄</p>
        </div>
      </div>
      <div
        class="bg-backgroundSurface flex items-center gap-2 rounded-xl border border-white/5 p-3"
      >
        <i class="i-mdi:theme-light-dark text-6 text-primary"></i>
        <div>
          <p class="font-600 text-sm">深色優化</p>
          <p class="text-textSecondary text-xs">夜間閱讀不刺眼</p>
        </div>
      </div>
      <div
        class="bg-backgroundSurface flex items-center gap-2 rounded-xl border border-white/5 p-3"
      >
        <i class="i-clarity:bolt-line text-6 text-primary"></i>
        <div>
          <p class="font-600 text-sm">體驗快速</p>
          <p class="text-textSecondary text-xs">30 秒完成設定</p>
        </div>
      </div>
    </section>

    <div class="mt-8 flex flex-col gap-5">
      <div class="text-center">
        <router-link
          :to="{ name: 'DeveloperGuide' }"
          class="bg-primary font-600 text-textColor inline-block h-12 rounded-2xl px-6 leading-[48px] no-underline shadow-md transition hover:shadow-lg"
        >
          點我檢視開發者說明
        </router-link>
      </div>

      <div class="text-center">
        <router-link
          :to="{ name: 'UsageNotes' }"
          class="bg-primary font-600 text-textColor inline-block h-12 rounded-2xl px-6 leading-[48px] no-underline shadow-md transition hover:shadow-lg"
        >
          使用須知
        </router-link>
      </div>
      <!-- 主 CTA -->
      <div class="text-center">
        <button
          class="bg-primary font-800 h-12 rounded-2xl px-6 text-black shadow-md transition hover:shadow-lg"
        >
          立即開始免費體驗
        </button>
        <p class="text-textSecondary mt-2 text-xs">連接Google立即體驗</p>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
// 元件
// 商業邏輯

// ---------------------------

// ----------區域----------
// -------------------------
</script>
