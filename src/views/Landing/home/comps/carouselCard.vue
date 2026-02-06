<template>
  <n-card :title="props.subtitle" size="small" class="h-full">
    <p class="text-textSecondary text-sm leading-tight" v-if="props.subtitle">
      {{ props.subtitle }}
    </p>

    <ul class="my-4 space-y-2" v-if="props.items && props.items.length">
      <li v-for="(it, idx) in props.items" :key="idx" class="flex items-start gap-2">
        <i class="i-mdi:check-circle-outline text-4.5 text-primary mt-0.5"></i>
        <p class="text-sm">{{ it }}</p>
      </li>
    </ul>

    <p class="text-textSecondary mb-3 text-xs" v-if="props.footer">{{ props.footer }}</p>

    <div class="mt-2">
      <!-- <slot name="actions">
        <button
          class="bg-primary/20 text-primary font-600 hover:bg-primary/30 h-11 w-full rounded-xl transition"
        >
          了解更多
        </button>
      </slot> -->
    </div>
  </n-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  subtitle?: string;
  items?: string[];
  footer?: string;
}>();
</script>

<style scoped>
/* 若需要額外樣式寫在這 */
</style>
