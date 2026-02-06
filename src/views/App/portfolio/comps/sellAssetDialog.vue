<template>
  <baseDialog
    v-model="visible"
    title="賣出資產"
    :ok-loading="loading"
    @ok="handleSubmit"
    :disabled="disableSubmit"
  >
    <n-form ref="formRef" :model="form" :rules="rules" label-width="80">
      <baseForm
        label="股票代碼"
        path="name"
        :component="NInput"
        v-model="form.stockId"
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
        :component-props="{ min: 0, step: 0.05, precision: 2, placeholder: '請輸入賣出價格' }"
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
        label="賣出應收付"
        path="realizedPnl"
        :component="NInputNumber"
        v-model="form.sellCost"
        class="w-90%"
        :component-props="{ placeholder: '請輸入賣出後總應收付(含稅)' }"
      />
      <baseForm
        label="實際損益"
        path="realizedPnl"
        :component="NInputNumber"
        v-model="form.realizedPnl"
        class="w-90%"
        :component-props="{ placeholder: '請輸入實際損益' }"
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
import type { StockRow, SellStockPayload } from '../api/index';
// 元件
import { baseDialog, baseForm } from '@/components/index';
// 商業邏輯
import { nonNegative, integerOnly, ymdValidator, today } from '@/utils/index';
// ---------------------------

// ----------props&emit----------
const props = defineProps<{
  assetValue: StockRow;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submitSellAsset', payload: { assetId: string | null; formValue: SellStockPayload }): void;
}>();
// ------------------------------

// ----------彈窗運作----------
const visible = defineModel<boolean>({ required: true }); // 是否顯示彈窗
const formRef = ref<FormInst | null>(null); // 表單實例
// 表單資料
const form = ref({
  assetId: '',
  stockId: '',
  stockName: '',
  quantity: 0,
  sellPrice: 0,
  sellQty: 0,
  sellCost: 0,
  realizedPnl: 0,
  sellDate: '',
  note: '',
});

const disableSubmit = computed(
  () =>
    form.value.sellCost <= 0 || // ← 改檢查值是否有效
    form.value.sellQty <= 0 ||
    form.value.sellPrice <= 0 ||
    !form.value.realizedPnl ||
    !form.value.sellDate
);
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
    { validator: integerOnly, trigger: ['blur'] },
  ],

  sellCost: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: nonNegative('賣出應收付'), trigger: ['input', 'blur'] },
  ],

  realizedPnl: [
    { required: true, type: 'number', message: '必填', trigger: ['input', 'blur'] },
    { validator: integerOnly, trigger: ['input', 'blur'] },
  ],

  sellDate: [
    { required: true, message: '必填', trigger: ['input', 'blur'] },
    { validator: ymdValidator, trigger: ['input', 'blur'] },
  ],

  note: [{ required: false, trigger: ['input', 'blur'] }],
};

// ---------------------------

// ----------表單事件----------

// 當父層傳入 assetValue 時把資料複製到 local form
watch(
  () => props.assetValue,
  (v) => {
    if (v) {
      form.value = {
        assetId: v.assetId ?? '',
        stockId: v.stockId ?? '',
        stockName: v.stockName ?? '',
        quantity: v.quantity ?? 0,
        sellPrice: v.buyPrice,
        sellQty: v.quantity,
        sellCost: v.totalCost,
        realizedPnl: 0,
        sellDate: today,
        note: '',
      };
    } else {
      form.value = {
        assetId: '',
        stockId: '',
        stockName: '',
        quantity: 0,
        sellPrice: 0,
        sellQty: 0,
        sellCost: 0,
        realizedPnl: 0,
        sellDate: '',
        note: '',
      };
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  // 表單驗證
  const ok = await formRef.value
    ?.validate()
    .then(() => true)
    .catch(() => false);
  if (!ok) return;
  // 型別窄化，避免 null 傳到後端
  const fv = form.value;
  if (fv.sellPrice === null || fv.sellQty === null || fv.realizedPnl === null || !fv.sellDate) {
    return;
  }

  const payload: SellStockPayload = {
    // 不包含 stockId / stockName 等多餘欄位
    sellPrice: Number(fv.sellPrice),
    sellQty: Number(fv.sellQty),
    realizedPnl: Number(fv.realizedPnl),
    sellCost: Number(fv.sellCost),
    sellDate: fv.sellDate,
    note: fv.note ?? '',
  };

  emit('submitSellAsset', { assetId: props.assetValue.assetId, formValue: payload });
};

// ---------------------------
</script>
