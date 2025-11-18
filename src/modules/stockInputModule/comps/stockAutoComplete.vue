<template>
  <n-auto-complete
    v-model:value="inputValue"
    :options="naiveOptions"
    :get-show="() => true"
    :placeholder="placeholder ?? '輸入股票代號或名稱'"
    clearable
    @update:value="handleInputUpdate"
    @select="handleSelect"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { AutoCompleteOption } from 'naive-ui';

export interface StockOption {
  stockId: string;
  stockName: string;
}

const props = defineProps<{
  options: StockOption[];
  value: StockOption | null; // v-model:value (真正選中的股票)
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:value', v: StockOption | null): void;
}>();

// input 顯示的字串，例如 "2330 台積電"
const inputValue = ref('');

// 依 inputValue 去算出 NAutoComplete 的選項
const naiveOptions = computed<AutoCompleteOption[]>(() => {
  const raw = inputValue.value.trim();
  if (!raw) return [];

  const k = raw.toLowerCase();

  const scored = props.options
    .map((option) => {
      const id = option.stockId.toLowerCase();
      const name = option.stockName.toLowerCase();

      let score = 0;

      // 代號優先
      if (id.startsWith(k)) score += 100;
      else if (id.includes(k)) score += 60;

      // 名稱其次
      if (name.startsWith(k)) score += 50;
      else if (name.includes(k)) score += 30;

      return { option, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  // NAutoComplete 的 options 需要 { label, value }
  return scored.map(({ option }) => ({
    label: `${option.stockId} ${option.stockName}`,
    value: option.stockId, // value 我們先用 stockId，選到時再從原陣列找回整個物件
  }));
});

// 使用者輸入時，只更新 inputValue，不馬上決定選中的股票
const handleInputUpdate = (v: string) => {
  inputValue.value = v;
  // 這裡可以視情況決定，要不要在輸入時就猜測 stock（通常不會）
};

// 下拉點選時，才真正決定選中的股票
const handleSelect = (value: string) => {
  const target = props.options.find((o) => o.stockId === value) || null;
  emit('update:value', target);
};

// 外部改變已選股票時，同步顯示在 input
watch(
  () => props.value,
  (newVal) => {
    if (!newVal) {
      inputValue.value = '';
      return;
    }
    inputValue.value = `${newVal.stockId} ${newVal.stockName}`;
  },
  { immediate: true }
);
</script>
