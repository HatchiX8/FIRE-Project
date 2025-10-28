<template>
  <baseDialog
    v-model="visible"
    title="編輯資產"
    :ok-loading="submitting"
    @ok="handleSubmit"
    @cancel="reset"
  >
    <n-form ref="formRef" :model="form" :rules="rules" label-width="80">
      <baseForm
        label="股票代碼"
        path="name"
        :component="NInput"
        v-model="form.name"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="買進價格"
        path="avgPrice"
        :component="NInputNumber"
        v-model="form.avgPrice"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="損益平衡點"
        path="buyPrice"
        :component="NInputNumber"
        v-model="form.buyPrice"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="買進股數"
        path="quantity"
        :component="NInputNumber"
        v-model="form.quantity"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="買進成本"
        path="buyCost"
        :component="NInputNumber"
        v-model="form.buyCost"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="買進日期"
        path="buyDate"
        :component="NInput"
        v-model="form.buyDate"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="備註"
        path="note"
        :component="NInput"
        v-model="form.note"
        class="w-90%"
        :component-props="{
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 6 },
          maxlength: 200,
          showCount: true,
          placeholder: '請輸入備註（可留空）',
        }"
      />
    </n-form>
  </baseDialog>
</template>

<script setup lang="ts">
// ----------import----------
// 套件
import { NInput, NInputNumber } from 'naive-ui';
// 共用型別
import type { FormInst, FormRules } from 'naive-ui';
// 元件
import { baseDialog, baseForm } from '@/components/index';
// 商業邏輯
// ---------------------------

// ----------彈窗運作----------
const visible = defineModel<boolean>({ required: true });
const submitting = ref(false);
const formRef = ref<FormInst | null>(null);
const form = reactive({
  id: '',
  name: '',
  buyPrice: null,
  avgPrice: null,
  quantity: null,
  buyCost: null,
  buyDate: '',
  note: '',
});
// ---------------------------

// ----------表單驗證----------

const rules: FormRules = {
  note: [{ required: false, trigger: ['input', 'blur'] }],
};

// ---------------------------

// ----------表單提交----------
async function handleSubmit() {
  console.log('往外emit去觸發請求API');
}

function reset() {
  // 可清空或還原
}
// ---------------------------
</script>
