<template>
  <n-modal v-model:show="show" :mask-closable="false" class="base-dialog-modal">
    <n-card
      class="base-dialog-card"
      :style="{ '--dialog-width': width }"
      :title="title"
      :bordered="false"
      :closable="true"
      :content-style="contentStyle"
      @close="onCancel"
    >
      <slot />
      <template #footer>
        <div class="base-dialog-footer flex justify-end gap-2">
          <baseButton
            class="base-dialog-footer-button"
            color="primary"
            ghost
            @click="onCancel"
            :disabled="okLoading"
          >
            取消
          </baseButton>
          <baseButton
            class="base-dialog-footer-button"
            color="primary"
            :loading="okLoading"
            @click="onOk"
            :disabled="okLoading || disabled"
          >
            確認
          </baseButton>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import baseButton from './baseButton.vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    width?: string;
    okLoading?: boolean;
    disabled?: boolean;
  }>(),
  { title: '視窗', width: '42rem', okLoading: false }
);

const emit = defineEmits<{
  'update:modelValue': [boolean];
  ok: [];
  cancel: [];
}>();

const contentStyle: Record<string, string> = {
  maxHeight: 'min(64vh, 34rem)',
  overflowY: 'auto',
};

const { modelValue } = toRefs(props);
const show = ref(modelValue.value);

watch(modelValue, (v) => (show.value = v));
watch(show, (v) => emit('update:modelValue', v));

const onOk = () => {
  emit('ok');
};

const onCancel = () => {
  show.value = false;
  emit('cancel');
};
</script>

<style scoped>
.base-dialog-card {
  width: min(calc(100vw - 2rem), var(--dialog-width));
  max-width: calc(100vw - 2rem);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 1.5rem;
  background: rgba(15, 23, 42, 0.92);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 24px 80px rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(28px);
}

.base-dialog-card :deep(.n-card-header) {
  padding: 1.25rem 1.25rem 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.base-dialog-card :deep(.n-card-header__main) {
  color: #f8fafc;
  font-size: 1rem;
  font-weight: 700;
}

.base-dialog-card :deep(.n-card__content) {
  padding: 1.25rem;
  scrollbar-color: rgba(99, 102, 241, 0.72) rgba(255, 255, 255, 0.04);
  scrollbar-width: thin;
}

.base-dialog-card :deep(.n-card__footer) {
  padding: 0.75rem 1.25rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.base-dialog-footer-button {
  min-width: 6rem;
}

@media (max-width: 640px) {
  .base-dialog-card {
    width: calc(100vw - 1rem);
    max-height: calc(100dvh - 1rem);
    border-radius: 1rem;
  }

  .base-dialog-card :deep(.n-card-header),
  .base-dialog-card :deep(.n-card__content),
  .base-dialog-card :deep(.n-card__footer) {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .base-dialog-footer {
    flex-direction: column-reverse;
  }

  .base-dialog-footer-button {
    width: 100%;
  }
}
</style>
