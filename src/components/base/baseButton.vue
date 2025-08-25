<template>
  <n-button :theme-overrides="buttonThemeOverrides" type="primary" v-bind="$attrs">
    <slot
  /></n-button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { themeColors } from '@/utils/index';

const props = defineProps<{
  color?: 'primary' | 'default';
}>();

const buttonThemeOverrides = computed(() => {
  if (props.color === 'primary') {
    return {
      common: {
        primaryColor: themeColors.colors.primary,
        primaryColorHover: themeColors.colors.primaryHover,
        primaryColorPressed: themeColors.colors.primaryActive,
      },
    };
  }
  return {
    common: {
      primaryColor: themeColors.colors.default,
      primaryColorHover: themeColors.colors.defaultHover,
      primaryColorPressed: themeColors.colors.defaultActive, // 按住不放的顏色
      primaryTextColor: '#FFFFFF',
    },
  };
});
</script>
