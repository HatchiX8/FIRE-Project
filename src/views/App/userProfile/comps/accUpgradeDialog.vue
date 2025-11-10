<template>
  <baseDialog
    v-model="visible"
    title="編輯用戶"
    :ok-loading="submitting"
    @ok="handleSubmit"
    @cancel="reset"
  >
    <n-form ref="formRef" :model="form" :rules="rules" label-width="80">
      <baseForm
        label="真實姓名"
        path="name"
        :component="NInput"
        v-model="form.name"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="審核說明"
        path="note"
        :component="NInput"
        v-model="form.note"
        class="w-90%"
        :component-props="{
          type: 'textarea',
          autosize: { minRows: 4, maxRows: 8 }, // 內容區更高
          placeholder: '輸入審核說明，以提高通過機率',
        }"
      />
    </n-form>
  </baseDialog>
</template>

<script setup lang="ts">
// ----------import----------
// 套件
import { NInput } from 'naive-ui';
// 共用型別
import type { FormInst, FormRules } from 'naive-ui';
// 元件
import { baseDialog, baseForm } from '@/components/index';
// 商業邏輯
// ---------------------------

// ----------props&emit----------
const props = defineProps<{
  userName: string;
}>();

const emit = defineEmits<{
  (e: 'close-dialog'): void;
  (e: 'submit-upgrade', payload: { note: string }): void;
}>();
// ------------------------------

const visible = defineModel<boolean>({ required: true }); // 彈窗顯示狀態
const submitting = ref(false); // 送出時的讀取狀態
const formRef = ref<FormInst | null>(null); // 表單實例
const form = ref({ id: '', name: props.userName, note: '' }); // 表單資料

// 表單驗證規則
const rules: FormRules = {
  name: { required: true, message: '必填' },
  note: { required: false, message: '非必填' },
};

// 表單事件
const handleSubmit = () => {
  emit('submit-upgrade', { note: form.value.note });
  reset();
};

// 重置表單
const reset = () => {
  // 可清空或還原表單
  form.value.note = '';
  emit('close-dialog');
};

// 監聽props並更新表單數值
watch(
  () => props.userName,
  (newName) => {
    form.value.name = newName;
  },
  { immediate: true }
);
</script>
