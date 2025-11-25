<template>
  <n-form-item :label="label" :path="path">
    <component :is="component" v-bind="mergedProps" @[updateEvent]="onUpdate" />
  </n-form-item>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

const props = defineProps<{
  label: string;
  path: string;
  component: Component;
  modelValue: unknown;
  componentProps?: Record<string, unknown>;
  valueProp?: string; // 預設 'value'
  updateEvent?: string; // 預設 'update:value'
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: unknown): void;
}>();

const valueProp = props.valueProp ?? 'value';
const updateEvent = props.updateEvent ?? 'update:value';
const onUpdate = (v: unknown) => emit('update:modelValue', v);

// 若 componentProps 已有該 valueProp 則優先，否則塞 modelValue
const mergedProps = computed(() => {
  const cp = { ...(props.componentProps ?? {}) } as Record<string, unknown>;
  if (cp[valueProp] === undefined) {
    cp[valueProp] = props.modelValue;
  }
  return cp;
});
</script>
