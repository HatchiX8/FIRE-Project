<template>
  <baseDialog v-model="visible" title="刪除資產" :ok-loading="loading" @ok="handleSubmit">
    <n-form ref="formRef" :model="form" label-width="80" class="max-h-80vh overflow-y-auto pr-2">
      <n-form-item label="股票代碼" class="w-90%">
        <n-input :value="reportValue.stockName" disabled />
      </n-form-item>
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
        label="賣出日期"
        path="sellDate"
        :component="NInput"
        v-model="form.sellDate"
        class="w-90%"
        :component-props="{ placeholder: '請輸入交易日期(YYYY-MM-DD)' }"
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
        label="備註"
        path="sellNote"
        :component="NInput"
        v-model="form.sellNote"
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
import type { FormInst } from 'naive-ui';
import type { StockRow, StockOption } from '../api/index';
// 元件
import { baseDialog, baseForm } from '@/components/index';
// 商業邏輯
// ---------------------------

// ----------props&emit----------
const props = defineProps<{
  reportValue: StockRow;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submitDeleteReport', reportId: string): void;
}>();
// ------------------------------

// ----------彈窗運作----------
const visible = defineModel<boolean>({ required: true }); // 是否顯示彈窗
const formRef = ref<FormInst | null>(null); // 表單實例
// 表單資料
const form = ref({
  stock: { stockId: '', stockName: '' } as StockOption,
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

// ---------------------------

// ----------表單事件----------

// 當父層傳入 reportValue 時把資料複製到 local form
watch(
  () => props.reportValue,
  (v) => {
    if (v) {
      form.value = {
        stock: { stockId: v.stockId ?? '', stockName: v.stockName ?? '' } as StockOption,
        buyPrice: v.buyPrice ?? 0,
        quantity: v.quantity ?? 0,
        buyCost: v.buyCost ?? 0,
        buyDate: v.buyDate ?? '',
        buyNote: v.buyNote ?? '',
        sellPrice: v.sellPrice ?? 0,
        sellQty: v.sellCost ?? 0,
        sellCost: v.sellCost ?? 0,
        realizedPnl: v.realizedPnl ?? 0,
        sellDate: v.sellDate ?? '',
        sellNote: v.sellNote ?? '',
      };
    } else {
      form.value = {
        stock: { stockId: '', stockName: '' },
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
    }
  },
  { immediate: true }
);

// 提交表單
const handleSubmit = async () => {
  emit('submitDeleteReport', props.reportValue?.tradesId || '');
};

// ---------------------------
</script>
