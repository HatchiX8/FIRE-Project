<template>
  <baseDialog
    v-model="visible"
    title="新增資產"
    :ok-loading="loading"
    @ok="handleSubmit"
    :disabled="disableSubmit"
  >
    <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80"
      class="max-h-80vh overflow-y-auto pr-2"
    >
      <stockInputModule
        label="股票代碼"
        path="stock"
        v-model="form.stockId"
        :options="props.stockOptions"
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
        :component-props="{ placeholder: '請輸入交易日期(YYYY-MM-DD)' }"
      />
      <baseForm
        label="備註"
        path="buyNote"
        :component="NInput"
        v-model="form.buyNote"
        class="w-90%"
        :component-props="{
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 3 }, // 內容區更高
          placeholder: '請輸入買進策略',
        }"
      />
      <baseForm
        label="賣出價格"
        path="sellPrice"
        :component="NInputNumber"
        v-model="form.sellPrice"
        class="w-90%"
        :component-props="{ min: 0, step: 0.05, precision: 2, placeholder: '請輸入賣出價格' }"
      />
      <baseForm
        label="賣出股數"
        path="sellQty"
        :component="NInputNumber"
        v-model="form.sellQty"
        class="w-90%"
        :component-props="{ min: 0, step: 100, precision: 0, placeholder: '實際股數，勿輸入張數' }"
      />
      <baseForm
        label="賣出應收付"
        path="buyCost"
        :component="NInputNumber"
        v-model="form.sellCost"
        class="w-90%"
        :component-props="{ min: 0, step: 1, precision: 0, placeholder: '請輸入實際賣出應收付' }"
      />
      <baseForm
        label="實際損益"
        path="realizedPnl"
        :component="NInputNumber"
        v-model="form.realizedPnl"
        class="w-90%"
        :component-props="{ placeholder: '請輸入賣出後總應收付(含稅)' }"
      />
      <baseForm
        label="賣出日期"
        path="sellDate"
        :component="NInput"
        v-model="form.sellDate"
        class="w-90%"
        :component-props="{ placeholder: '請輸入交易日期(YYYY-MM-DD)' }"
      />
      <baseForm
        label="備註"
        path="sellNote"
        :component="NInput"
        v-model="form.sellNote"
        class="w-90%"
        :component-props="{
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 3 }, // 內容區更高
          placeholder: '請輸入賣出備註',
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
import type { NewReportPayload } from '../api/index';
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
  (e: 'submitNewReport', payload: NewReportPayload): void;
}>();
// ------------------------------

// ----------彈窗運作----------
const visible = defineModel<boolean>({ required: true }); // 是否顯示彈窗
const formRef = ref<FormInst | null>(null); // 表單實例
// 表單資料
const form = ref({
  stockId: { stockId: '', stockName: '' } as StockOption,
  buyPrice: 0,
  quantity: 0,
  buyCost: 0,
  buyDate: '',
  buyNote: '',
  sellPrice: 0,
  sellQty: 0,
  sellCost: 0,
  realizedPnl: 0,
  sellDate: '',
  sellNote: '',
});

const disableSubmit = computed(
  () =>
    !form.value.stockId?.stockId ||
    form.value.buyPrice === null ||
    form.value.quantity === null ||
    form.value.buyCost === null ||
    !form.value.buyDate ||
    form.value.sellPrice === null ||
    form.value.sellQty === null ||
    form.value.sellCost === null ||
    !form.value.realizedPnl ||
    !form.value.sellDate
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

  sellPrice: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('賣出價格'), trigger: ['input', 'blur'] },
  ],
  sellQty: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('賣出股數'), trigger: ['input', 'blur'] },
    { validator: integerOnly, trigger: ['blur'] },
  ],
  sellCost: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('賣出應收付'), trigger: ['input', 'blur'] },
  ],
  sellDate: [
    { required: true, message: '必填', trigger: ['input', 'blur'] },
    { validator: ymdValidator, trigger: ['input', 'blur'] },
  ],

  realizedPnl: [{ required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] }],

  sellNote: [{ required: false, trigger: ['input', 'blur'] }],
};

// ----------表單事件----------
// 提交表單
const handleSubmit = async () => {
  emit('submitNewReport', {
    stockId: form.value.stockId.stockId,
    buyPrice: form.value.buyPrice!,
    quantity: form.value.quantity!,
    buyCost: form.value.buyCost!,
    buyDate: form.value.buyDate!,
    buyNote: form.value.buyNote!,

    sellPrice: form.value.sellPrice!,
    sellQty: form.value.quantity!,
    sellCost: form.value.realizedPnl!,
    realizedPnl: form.value.realizedPnl!,
    sellDate: form.value.sellDate!,
    sellNote: form.value.sellNote!,
  });

  resetForm();
};

// 新增：重置表單
const resetForm = () => {
  form.value = {
    stockId: { stockId: '', stockName: '' } as StockOption,
    buyPrice: 0,
    quantity: 0,
    buyCost: 0,
    buyDate: '',
    buyNote: '',
    sellPrice: 0,
    sellQty: 0,
    sellCost: 0,
    realizedPnl: 0,
    sellDate: '',
    sellNote: '',
  };
};
// ---------------------------
</script>
