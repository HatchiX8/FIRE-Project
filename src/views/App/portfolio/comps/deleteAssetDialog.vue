<template>
  <baseDialog v-model="visible" title="刪除資產" :ok-loading="submitting" @ok="handleSubmit">
    <n-form ref="formRef" :model="form" label-width="80">
      <baseForm
        label="股票代碼"
        path="name"
        :component="NInput"
        v-model="form.stockId"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="買進價格"
        path="avgPrice"
        :component="NInputNumber"
        v-model="form.buyPrice"
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
        label="總成本"
        path="totalCost"
        :component="NInputNumber"
        v-model="form.totalCost"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="總市值"
        path="marketValue"
        :component="NInputNumber"
        v-model="form.marketValue"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="日期"
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
          disabled: true,
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
import type { StockRow } from '../api/index';
// 元件
import { baseDialog, baseForm } from '@/components/index';
// 商業邏輯
// ---------------------------

// ----------props&emit----------
const props = defineProps<{
  assetValue: StockRow;
}>();

const emit = defineEmits<{
  (e: 'submitDeleteAsset', assetId: string): void;
}>();
// ------------------------------

// ----------彈窗運作----------
const visible = defineModel<boolean>({ required: true }); // 是否顯示彈窗
const submitting = ref(false); // 送出時的讀取狀態
const formRef = ref<FormInst | null>(null); // 表單實例
// 表單資料
const form = ref({
  assetId: props.assetValue.assetId || '',
  stockId: props.assetValue.stockId || '',
  stockName: props.assetValue.stockName || '',
  buyPrice: props.assetValue.buyPrice || 0,
  quantity: props.assetValue.quantity || 0,
  totalCost: props.assetValue.totalCost || 0,
  marketValue: props.assetValue.marketValue || 0,
  buyDate: props.assetValue.buyDate || '',
  note: props.assetValue.note || '',
});

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
        buyPrice: v.buyPrice ?? 0,
        quantity: v.quantity ?? 0,
        totalCost: v.totalCost ?? 0,
        marketValue: v.marketValue ?? 0,
        buyDate: v.buyDate ?? '',
        note: v.note ?? '',
      };
    } else {
      form.value = {
        assetId: '',
        stockId: '',
        stockName: '',
        buyPrice: 0,
        quantity: 0,
        totalCost: 0,
        marketValue: 0,
        buyDate: '',
        note: '',
      };
    }
  },
  { immediate: true }
);

// 提交表單
const handleSubmit = async () => {
  emit('submitDeleteAsset', props.assetValue.assetId || '');
};

// ---------------------------
</script>
