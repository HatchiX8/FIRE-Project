<template>
  <baseDialog
    v-model="visible"
    title="編輯用戶"
    :ok-loading="submitting"
    @ok="handleSubmit"
    @cancel="reset"
  >
    <n-form ref="formRef" :model="form" :rules="rules" label-width="80">
      <baseForm label="姓名" path="name" :component="NInput" v-model="form.name" />
      <baseForm
        label="Email"
        path="email"
        :component="NInput"
        v-model="form.email"
        :component-props="{ type: 'email' }"
        class="w-80"
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

const visible = defineModel<boolean>({ required: true });
const submitting = ref(false);
const formRef = ref<FormInst | null>(null);
const form = reactive({ id: '', name: '', email: '' });

const rules: FormRules = {
  name: { required: true, message: '必填' },
  email: { required: true, message: '必填' },
};

async function handleSubmit() {
  console.log('往外emit去觸發請求API');
}

function reset() {
  // 可清空或還原
}
</script>
