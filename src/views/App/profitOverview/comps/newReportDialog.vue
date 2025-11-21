<template>
  <baseDialog v-model="visible" title="新增資產" :ok-loading="submitting" @ok="handleSubmit">
    <n-form ref="formRef" :model="form" :rules="rules" label-width="80">
      <stockInputModule
        label="股票代碼"
        path="stock"
        v-model="form.stock"
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
        label="賣出價格"
        path="sellPrice"
        :component="NInputNumber"
        v-model="form.sellPrice"
        class="w-90%"
        :component-props="{ min: 0, step: 0.05, precision: 2, placeholder: '請輸入買進價格' }"
      />
      <baseForm
        label="交易股數"
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
        label="賣出實際價格"
        path="actualRealizedPnl"
        :component="NInputNumber"
        v-model="form.actualRealizedPnl"
        class="w-90%"
        :component-props="{ min: 0, step: 1, precision: 0, placeholder: '請輸入實際賣出價格' }"
      />
      <baseForm
        label="交易日期"
        path="tradesDate"
        :component="NInput"
        v-model="form.tradesDate"
        class="w-90%"
        :component-props="{ placeholder: '請輸入交易日期(YYYY-MM-DD)' }"
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
      <n-form-item label="是否已算入總資金" class="w-90%">
        <n-checkbox v-model:checked="form.isCalculateTotal"
          >是(如勾選是，該筆紀錄將不會計算進總資金)</n-checkbox
        >
      </n-form-item>
    </n-form>
  </baseDialog>
</template>

<script setup lang="ts">
// ----------import----------
// 套件
import { NInput, NInputNumber } from 'naive-ui';
// 共用型別
import type { FormInst, FormRules } from 'naive-ui';
import type { NewReportData } from '../api/index';
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
}>();

const emit = defineEmits<{
  (e: 'submitNewAsset', payload: NewReportData): void;
}>();
// ------------------------------

// ----------彈窗運作----------
const visible = defineModel<boolean>({ required: true }); // 是否顯示彈窗
const submitting = ref(false); // 送出時的讀取狀態
const formRef = ref<FormInst | null>(null); // 表單實例
// 表單資料
const form = ref({
  stock: { stockId: '', stockName: '' } as StockOption,
  buyPrice: null,
  sellPrice: null,
  quantity: null,
  buyCost: null,
  actualRealizedPnl: null,
  tradesDate: '',
  note: '',
  isCalculateTotal: false,
});
// ---------------------------

// ----------表單驗證----------
// 表單驗證規則
const rules: FormRules = {
  name: [{ required: true, message: '必填', trigger: ['input', 'blur'] }],

  buyPrice: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('買進價格'), trigger: ['input', 'blur'] },
  ],
  buyCost: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('買進成本'), trigger: ['input', 'blur'] },
  ],
  sellPrice: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('賣出價格'), trigger: ['input', 'blur'] },
  ],

  quantity: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('交易股數'), trigger: ['input', 'blur'] },
    { validator: integerOnly, trigger: ['blur'] },
  ],

  actualRealizedPnl: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('實際總價'), trigger: ['input', 'blur'] },
  ],

  tradesDate: [
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
    stockId: form.value.stock.stockId,
    buyPrice: form.value.buyPrice!,
    sellPrice: form.value.sellPrice!,
    actualRealizedPnl: form.value.actualRealizedPnl!,
    quantity: form.value.quantity!,
    buyCost: form.value.buyCost!,
    tradesDate: form.value.tradesDate,
    note: form.value.note || undefined,
    isCalculateTotal: form.value.isCalculateTotal,
  });

  resetForm();
};

// 新增：重置表單
const resetForm = () => {
  form.value = {
    stock: { stockId: '', stockName: '' } as StockOption,
    buyPrice: null,
    sellPrice: null,
    actualRealizedPnl: null,
    quantity: null,
    buyCost: null,
    tradesDate: '',
    note: '',
    isCalculateTotal: false,
  };
};
// ---------------------------
</script>
