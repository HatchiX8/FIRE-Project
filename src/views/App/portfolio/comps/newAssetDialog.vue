<template>
  <baseDialog
    v-model="visible"
    title="新增資產"
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
        :component-props="{ placeholder: '請輸入股票代碼或名稱' }"
      />
      <baseForm
        label="買進價格"
        path="avgPrice"
        :component="NInputNumber"
        v-model="form.avgPrice"
        class="w-90%"
        :component-props="{ min: 0, step: 0.05, precision: 2, placeholder: '請輸入買進價格' }"
      />
      <baseForm
        label="損益平衡點"
        path="buyPrice"
        :component="NInputNumber"
        v-model="form.buyPrice"
        class="w-90%"
        :component-props="{ min: 0, step: 0.05, precision: 2, placeholder: '請輸入損益平衡點' }"
      />
      <baseForm
        label="買進股數"
        path="quantity"
        :component="NInputNumber"
        v-model="form.quantity"
        class="w-90%"
        :component-props="{ min: 0, step: 100, precision: 0, placeholder: '整數1000為單位' }"
      />
      <baseForm
        label="買進成本"
        path="buyCost"
        :component="NInputNumber"
        v-model="form.buyCost"
        class="w-90%"
        :component-props="{ min: 0, step: 1, precision: 0, placeholder: '請輸入實際買進成本' }"
      />
      <baseForm
        label="買進日期"
        path="buyDate"
        :component="NInput"
        v-model="form.buyDate"
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
import type { FormInst, FormRules, FormItemRule } from 'naive-ui';
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
  buyPrice: 0,
  avgPrice: 0,
  quantity: null,
  buyCost: null,
  buyDate: '',
  note: '',
});
// ---------------------------

// ----------表單驗證----------
// 共用：不可小於 0 驗證器
const nonNegative =
  (label = '數值'): FormItemRule['validator'] =>
  (_rule, v: number) =>
    v >= 0 ? true : new Error(`${label}不可小於 0`);

// 共用：需為整數驗證（股數用）
const integerOnly: FormItemRule['validator'] = (_r, v: number) =>
  Number.isInteger(v) ? true : new Error('須為整數');

function isLeapYear(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

const ymdValidator: FormItemRule['validator'] = (_r, v: string) => {
  if (typeof v !== 'string') return new Error('日期需為字串');
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return new Error('格式需為 YYYY-MM-DD，例如 2025-09-02');

  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);

  if (month < 1 || month > 12) return new Error('月份需為 01–12');

  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const maxDay = daysInMonth[month - 1];
  if (day < 1 || day > maxDay) return new Error(`該月天數為 ${maxDay} 天`);

  return true;
};

const rules: FormRules = {
  name: [{ required: true, message: '必填', trigger: ['input', 'blur'] }],

  avgPrice: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('買進價格'), trigger: ['input', 'blur'] },
  ],

  buyPrice: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('損益平衡點'), trigger: ['input', 'blur'] },
  ],

  quantity: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('買進股數'), trigger: ['input', 'blur'] },
    { validator: integerOnly, trigger: ['blur'] },
  ],

  buyCost: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('買進成本'), trigger: ['input', 'blur'] },
  ],

  buyDate: [
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
