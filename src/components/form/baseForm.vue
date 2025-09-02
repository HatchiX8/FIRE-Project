<template>
  <n-form-item :label="label" :path="path">
    <component
      :is="component"
      v-bind="{
        ...componentProps,
        [valueProp]: modelValue,
      }"
      @[updateEvent]="onUpdate"
    />
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
</script>
