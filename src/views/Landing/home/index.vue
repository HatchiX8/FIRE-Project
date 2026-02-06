<template>
  <section class="text-textColor px-4 py-3">
    <h2 class="text-6 mb-4 flex justify-center font-bold">FIRE 投資記帳特色</h2>

    <div class="md:hidden">
      <n-carousel draggable autoplay :show-dots="false" class="h-66 rounded-2xl">
        <n-carousel-item v-for="(c, i) in cards" :key="i">
          <carouselCard :title="c.title" :subtitle="c.subtitle" :items="c.items" :footer="c.footer">
            <template #actions v-if="showCtaButtons">
              <button
                class="bg-primary font-700 h-11 w-full rounded-xl text-base text-black transition hover:opacity-90"
              >
                {{ c.ctaText || '了解更多' }}
              </button>
            </template>
          </carouselCard>
        </n-carousel-item>
      </n-carousel>
    </div>

    <div class="hidden gap-4 md:grid md:grid-cols-3">
      <carouselCard
        v-for="(c, i) in cards"
        :key="i"
        :title="c.title"
        :subtitle="c.subtitle"
        :items="c.items"
        :footer="c.footer"
      >
        <template #actions v-if="showCtaButtons">
          <button
            class="bg-primary font-700 h-10 w-full rounded-xl text-base text-black transition hover:opacity-90"
          >
            {{ c.ctaText || '了解更多' }}
          </button>
        </template>
      </carouselCard>
    </div>

    <featureGrid :features="features" class="flex justify-center" />

    <div class="flex flex-col gap-5">
      <heroCTA />
    </div>

    <div class="mt-8 hidden justify-center md:flex">
      <p class="text-textSecondary blink-text text-xl">本網頁使用手機為最佳體驗</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { carouselCard, featureGrid, heroCTA } from './comps/index';

const showCtaButtons = false; // 改為 true 時按鈕會出現

const cards = [
  {
    title: '完整記錄每一筆操作',
    subtitle: '你的投資紀錄本，回頭看得見當下思路',
    items: [
      '買/賣價格、股數、損益、備註一次到位',
      '一鍵建立歷史成交，快速補帳',
      '隨時修正錯誤輸入，維持資料準確',
    ],
    footer: '主升段追進或回測驗證，這裡都是最誠實的紀錄本。',
    ctaText: '立即體驗日誌 →',
  },
  {
    title: '水位配置與損益趨勢',
    subtitle: '看得懂自己做了什麼，決策更踏實',
    items: ['買/自動計算現金比例與股票配置', '近一年趨勢圖，追蹤表現變化', '總資產趨勢圖(規劃中)'],
    footer: '成績不只是數字，更是策略修正的依據。',
    ctaText: '查看我的趨勢 →',
  },
  {
    title: '進階功能，系統化投資',
    subtitle: '不只記錄，還能驅動流程',
    items: [
      '買/追蹤清單＋自訂進場策略與條件(規劃中)',
      '收藏關鍵賣出操作，累積經典範例（規劃中）',
      '每週彙整操作摘要與回顧（規劃中）',
    ],
    footer: '長期修行，有系統才走得遠，我們是你的數據夥伴。',
    ctaText: '解鎖進階功能 →',
  },
];

const features = [
  // {
  //   iconClass: 'i-mdi:shield-check-outline text-6 text-primary',
  //   title: '資料安全',
  //   subtitle: '支援匯出與刪除',
  // },
  // {
  //   iconClass: 'i-mdi:file-export-outline text-6 text-primary',
  //   title: 'CSV 匯出',
  //   subtitle: '一鍵備份你的紀錄',
  // },
  {
    iconClass: 'i-mdi:theme-light-dark text-6 text-primary',
    title: '深色優化',
    subtitle: '夜間閱讀不刺眼',
  },
  {
    iconClass: 'i-clarity:bolt-line text-6 text-primary',
    title: '體驗快速',
    subtitle: '登入即可開始使用',
  },
];
</script>

<style scoped>
/* 從明確灰色到白色，並加上發光與輕微縮放以提升可見度 */
@keyframes blinkColor {
  0% {
    color: #9ca3af; /* 明顯灰（可調整） */
    text-shadow: none;
    transform: scale(1);
  }
  50% {
    color: #ffffff; /* 白色 */
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.75);
    transform: scale(1.03);
  }
  100% {
    color: #9ca3af;
    text-shadow: none;
    transform: scale(1);
  }
}

/* 更短週期與較強效果 */
.blink-text {
  animation: blinkColor 3s ease-in-out infinite;
  will-change: color, transform, text-shadow;
  font-weight: 600; /* 可選：讓白色更顯眼 */
}

/* 若使用者偏好減少動態效果，關閉動畫 */
@media (prefers-reduced-motion: reduce) {
  .blink-text {
    animation: none;
    transform: none;
    text-shadow: none;
  }
}
</style>
