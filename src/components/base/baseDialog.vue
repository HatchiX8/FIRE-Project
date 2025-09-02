<template>
  <n-modal v-model:show="show" :mask-closable="false">
    <n-card :style="{ width }" :title="title" :bordered="false">
      <slot />
      <template #footer>
        <div class="flex justify-end gap-2">
          <baseButton color="primary" ghost @click="onCancel" :disabled="okLoading"
            >取消</baseButton
          >
          <baseButton color="primary" :loading="okLoading" @click="onOk">確定</baseButton>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
// 元件
import { baseButton } from '@/components/index';
// 商業邏輯
// ---------------------------

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    width?: string;
    okLoading?: boolean;
  }>(),
  { title: '視窗', width: '90%', okLoading: false }
);

const emit = defineEmits<{
  'update:modelValue': [boolean];
  ok: [];
  cancel: [];
}>();

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
