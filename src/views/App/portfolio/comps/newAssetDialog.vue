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
        path="buyPrice"
        :component="NInputNumber"
        v-model="form.buyPrice"
        class="w-90%"
        :component-props="{ min: 0, step: 0.05, precision: 2, placeholder: '請輸入買進價格' }"
      />
      <baseForm
        label="損益平衡點"
        path="avgPrice"
        :component="NInputNumber"
        v-model="form.avgPrice"
        class="w-90%"
        :component-props="{ min: 0, step: 0.05, precision: 2, placeholder: '請輸入損益平衡點' }"
      />
      <baseForm
        label="買進股數"
        path="quantity"
        :component="NInputNumber"
        v-model="form.quantity"
        class="w-90%"
        :component-props="{ min: 0, step: 100, precision: 0, placeholder: '實際股數，勿輸入張數' }"
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
  buyPrice: null,
  avgPrice: null,
  quantity: null,
  buyCost: null,
  buyDate: '',
  note: '',
});
// ---------------------------

// ----------表單驗證----------
// 表單驗證規則
const rules: FormRules = {
  name: [{ required: true, message: '必填', trigger: ['input', 'blur'] }],

  avgPrice: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('損益平衡點'), trigger: ['input', 'blur'] },
  ],

  buyPrice: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('買進價格'), trigger: ['input', 'blur'] },
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

// ----------表單事件----------
// 提交表單
const handleSubmit = async () => {
  console.log('往外emit去觸發請求API');
};

// 表單重置
function reset() {
  // 可清空或還原
}
// ---------------------------
</script>
