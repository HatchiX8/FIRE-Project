<template>
  <n-form-item :label="props.label" :path="props.path">
    <stockAutoComplete
      class="w-full"
      :options="options"
      :value="modelValue"
      :placeholder="placeholder"
      @update:value="onUpdate"
    />
  </n-form-item>
</template>

<script setup lang="ts">
import type { StockOption } from './types';
import stockAutoComplete from './comps/stockAutoComplete.vue';

const props = defineProps<{
  label: string;
  path: string;
  modelValue: StockOption | null;
  options: StockOption[];
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: StockOption | null): void;
}>();

const onUpdate = (v: StockOption | null) => {
  emit('update:modelValue', v);
};
</script>
