<template>
  <baseDialog
    v-model="visible"
    title="賣出資產"
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
        label="持有股數"
        path="quantity"
        :component="NInputNumber"
        v-model="form.quantity"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="賣出價格"
        path="sellPrice"
        :component="NInputNumber"
        v-model="form.sellPrice"
        class="w-90%"
        :component-props="{ min: 0, step: 0.05, precision: 2, placeholder: '請輸入損益平衡點' }"
      />

      <baseForm
        label="賣出股數"
        path="sellQty"
        :component="NInputNumber"
        v-model="form.sellQty"
        class="w-90%"
        :component-props="{ min: 0, step: 1, precision: 0, placeholder: '實際股數，勿輸入張數' }"
      />
      <baseForm
        label="賣出總價"
        path="actualRealizedPnl"
        :component="NInput"
        v-model="form.actualRealizedPnl"
        class="w-90%"
        :component-props="{ placeholder: '請輸入賣出後總金額(含稅)' }"
      />
      <baseForm
        label="賣出日期"
        path="sellDate"
        :component="NInput"
        v-model="form.sellDate"
        class="w-90%"
        :component-props="{ placeholder: '請輸入買進日期(YYYY-MM-DD)' }"
      />
      <baseForm
        label="備註"
        path="note"
        :component="NInput"
        v-model="form.note"
        class="w-90%"
        :component-props="{
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 3 }, // 內容區更高
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
import { nonNegative, integerOnly, ymdValidator } from '@/utils/index';
// ---------------------------

// ----------彈窗運作----------
const visible = defineModel<boolean>({ required: true }); // 是否顯示彈窗
const submitting = ref(false); // 送出時的讀取狀態
const formRef = ref<FormInst | null>(null); // 表單實例
// 表單資料
const form = ref({
  id: '',
  name: '',
  quantity: null,
  sellPrice: null,
  sellQty: null,
  actualRealizedPnl: null,
  sellDate: '',
  note: '',
});
// ---------------------------

// ----------表單驗證----------
// 表單驗證規則
const rules: FormRules = {
  sellPrice: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('賣出價格'), trigger: ['input', 'blur'] },
  ],

  sellQty: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('賣出股數'), trigger: ['input', 'blur'] },
  ],

  actualRealizedPnl: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('賣出總價'), trigger: ['input', 'blur'] },
    { validator: integerOnly, trigger: ['blur'] },
  ],
  sellDate: [
    { required: true, message: '必填', trigger: ['input', 'blur'] },
    { validator: ymdValidator, trigger: ['input', 'blur'] },
  ],
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
