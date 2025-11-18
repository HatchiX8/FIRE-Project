<template>
  <div class="relative w-full">
    <!-- 輸入框 -->
    <input
      v-model="keyword"
      type="text"
      class="w-full rounded border px-2 py-1"
      placeholder="輸入股票代號或名稱"
      @focus="open = true"
      @blur="handleBlur"
      @keydown.down.prevent="moveActive(1)"
      @keydown.up.prevent="moveActive(-1)"
      @keydown.enter.prevent="handleEnter"
    />

    <!-- 下拉清單 -->
    <ul
      v-if="open && filteredOptions.length > 0"
      class="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded border bg-black shadow"
    >
      <li
        v-for="(item, index) in filteredOptions"
        :key="item.stockId"
        class="cursor-pointer px-2 py-1"
        :class="index === activeIndex ? 'bg-black' : ''"
        @mousedown.prevent="select(item)"
        @mousemove="activeIndex = index"
      >
        <span class="mr-2 font-mono">{{ item.stockId }}</span>
        <span>{{ item.stockName }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface StockOption {
  stockId: string;
  stockName: string;
}
// props / emits
const props = defineProps<{
  options: StockOption[];
  modelValue: StockOption | null; // 也可以改成 string 看你要回傳什麼
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: StockOption | null): void;
}>();

const keyword = ref('');
const open = ref(false);
const activeIndex = ref<number>(-1);

// 使用者輸入關鍵字後的候選清單
const filteredOptions = computed<StockOption[]>(() => {
  const raw = keyword.value.trim();
  if (!raw) return []; // ⭐ 沒輸入就不顯示任何選項

  const k = raw.toLowerCase();

  const scored = props.options
    .map((option) => {
      const id = option.stockId.toLowerCase();
      const name = option.stockName.toLowerCase(); // 中文也OK，不影響

      let score = 0;

      // 代號優先
      if (id.startsWith(k)) score += 100;
      else if (id.includes(k)) score += 60;

      // 名稱次之
      if (name.startsWith(k)) score += 50;
      else if (name.includes(k)) score += 30;

      return { option, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return scored.map((x) => x.option);
});

// 選擇某個股票
const select = (item: StockOption) => {
  keyword.value = `${item.stockId} ${item.stockName}`;
  emit('update:modelValue', item);
  open.value = false;
};

// blur 的時候稍微延遲一下，避免 click 被吃掉
const handleBlur = () => {
  setTimeout(() => {
    open.value = false;
    activeIndex.value = -1;
  }, 150);
};

// 鍵盤上下選項
const moveActive = (delta: number) => {
  if (!open.value || filteredOptions.value.length === 0) return;

  const maxIndex = filteredOptions.value.length - 1;
  if (activeIndex.value === -1) {
    activeIndex.value = 0;
    return;
  }

  let next = activeIndex.value + delta;
  if (next < 0) next = maxIndex;
  if (next > maxIndex) next = 0;
  activeIndex.value = next;
};

// Enter 選擇目前 active 的項目
const handleEnter = () => {
  if (
    !open.value ||
    filteredOptions.value.length === 0 ||
    activeIndex.value < 0 ||
    activeIndex.value >= filteredOptions.value.length
  )
    return;

  select(filteredOptions.value[activeIndex.value]);
};

// 如果外部有改 modelValue，就同步 keyword 顯示
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      keyword.value = '';
      return;
    }
    keyword.value = `${newVal.stockId} ${newVal.stockName}`;
  },
  { immediate: true }
);
</script>
