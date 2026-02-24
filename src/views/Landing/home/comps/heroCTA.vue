<template>
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

    <div class="text-center">
      <button
        class="bg-primary font-800 h-12 rounded-2xl px-6 text-black shadow-md transition hover:shadow-lg"
      >
        立即開始免費體驗
      </button>
      <p class="text-textSecondary mt-2 text-xs">連接Google立即體驗</p>
    </div>
  </div>
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
