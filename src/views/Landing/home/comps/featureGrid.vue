<template>
  <section :class="containerClass">
    <div
      v-for="(f, i) in props.features"
      :key="i"
      class="bg-backgroundSurface flex items-center gap-2 rounded-xl border border-white/5 p-3"
    >
      <i :class="f.iconClass"></i>
      <div>
        <p class="font-600 text-sm">{{ f.title }}</p>
        <p class="text-textSecondary text-xs">{{ f.subtitle }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

const props = defineProps<{
  features: { iconClass: string; title: string; subtitle?: string }[];
}>();

const containerClass = computed(
  () => 'mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-6xl mx-auto'
);
</script>
