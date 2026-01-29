<template>
  <baseDialog
    v-model="visible"
    title="新增資產"
    :ok-loading="loading"
    @ok="handleSubmit"
    :disabled="disableSubmit"
  >
    <n-form ref="formRef" :model="form" :rules="rules" label-width="80">
      <stockInputModule
        label="股票代碼"
        path="stock"
        v-model="form.stockId"
        :options="props.stockOptions"
        class="w-90%"
        :component-props="{ placeholder: '請輸入股票代碼或名稱' }"
      />
      <!-- <baseForm
        label="股票代碼"
        path="name"
        :component="NInput"
        v-model="form.name"
        class="w-90%"
        :component-props="{ placeholder: '請輸入股票代碼或名稱' }"
      /> -->
      <baseForm
        label="買進價格"
        path="buyPrice"
        :component="NInputNumber"
        v-model="form.buyPrice"
        class="w-90%"
        :component-props="{ min: 0, step: 0.05, precision: 2, placeholder: '請輸入買進價格' }"
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
import type { AddStockPayload } from '../api/index';
// 元件
import { baseDialog, baseForm } from '@/components/index';
import { stockInputModule } from '@/modules/index';
// 商業邏輯
import { nonNegative, integerOnly, ymdValidator } from '@/utils/index';
// ---------------------------

// ----------type----------
interface StockOption {
  stockId: string;
  stockName: string;
}
// ------------------------

// ----------props&emit----------
const props = defineProps<{
  stockOptions: StockOption[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submitNewAsset', payload: AddStockPayload): void;
}>();
// ------------------------------

// ----------彈窗運作----------
const visible = defineModel<boolean>({ required: true }); // 是否顯示彈窗
const formRef = ref<FormInst | null>(null); // 表單實例
// 表單資料
const form = ref({
  stockId: { stockId: '', stockName: '' } as StockOption,
  buyPrice: null,
  quantity: null,
  buyCost: null,
  buyDate: '',
  note: null,
});

const disableSubmit = computed(
  () =>
    !form.value.stockId?.stockId ||
    form.value.buyPrice === null ||
    form.value.quantity === null ||
    form.value.buyCost === null ||
    !form.value.buyDate
);
// ---------------------------

// ----------表單驗證----------
// 表單驗證規則
const rules: FormRules = {
  stockId: [{ required: true, message: '必填', trigger: ['input', 'blur'] }],

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
  emit('submitNewAsset', {
    stockId: form.value.stockId.stockId,
    buyPrice: form.value.buyPrice!,
    quantity: form.value.quantity!,
    buyCost: form.value.buyCost!,
    buyDate: form.value.buyDate,
    note: form.value.note || undefined,
  });

  resetForm();
};

// 新增：重置表單
const resetForm = () => {
  form.value = {
    stockId: { stockId: '', stockName: '' } as StockOption,
    buyPrice: null,
    quantity: null,
    buyCost: null,
    buyDate: '',
    note: null,
  };
};
// ---------------------------
</script>
