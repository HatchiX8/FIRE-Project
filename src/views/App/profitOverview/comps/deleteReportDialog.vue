<template>
  <baseDialog v-model="visible" title="刪除資產" :ok-loading="submitting" @ok="handleSubmit">
    <n-form ref="formRef" :model="form" label-width="80">
      <n-form-item label="股票代碼" class="w-90%">
        <n-input :value="stockLabel" disabled />
      </n-form-item>
      <baseForm
        label="買進成本"
        path="buyCost"
        :component="NInput"
        v-model="form.buyCost"
        class="w-90%"
        :component-props="{ value: formatPriceUnit(form.buyCost), disabled: true }"
      />
      <baseForm
        label="賣出價格"
        path="actualRealizedPnl"
        :component="NInput"
        v-model="form.actualRealizedPnl"
        class="w-90%"
        :component-props="{ value: formatPriceUnit(form.actualRealizedPnl), disabled: true }"
      />
      <baseForm
        label="實際損益"
        path="stockProfit"
        :component="NInput"
        v-model="form.stockProfit"
        class="w-90%"
        :component-props="{ value: formatPriceUnit(form.stockProfit), disabled: true }"
      />
      <baseForm
        label="賣出日期"
        path="tradesDate"
        :component="NInput"
        v-model="form.tradesDate"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="備註"
        path="note"
        :component="NInput"
        v-model="form.note"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
    </n-form>
  </baseDialog>
</template>

<script setup lang="ts">
// ----------import----------
// 套件
import { NInput } from 'naive-ui';
// 共用型別
import type { FormInst } from 'naive-ui';
import type { StockRow, StockOption } from '../api/index';
// 元件
import { baseDialog, baseForm } from '@/components/index';
// 商業邏輯
import { useStockLabel, formatPriceUnit } from '@/utils/index';
// ---------------------------

// ----------props&emit----------
const props = defineProps<{
  reportValue: StockRow;
}>();

const emit = defineEmits<{
  (e: 'submitDeleteReport', reportId: string): void;
}>();
// ------------------------------

// ----------彈窗運作----------
const visible = defineModel<boolean>({ required: true }); // 是否顯示彈窗
const submitting = ref(false); // 送出時的讀取狀態
const formRef = ref<FormInst | null>(null); // 表單實例
// 表單資料
const form = ref({
  stock: { stockId: '', stockName: '' } as StockOption,
  buyPrice: 0,
  sellPrice: 0,
  quantity: 0,
  buyCost: 0,
  actualRealizedPnl: 0,
  stockProfit: 0,
  tradesDate: '',
  note: '',
});

// ---------------------------

// ----------表單事件----------
const { stockLabel } = useStockLabel(computed(() => form.value.stock));

// 當父層傳入 reportValue 時把資料複製到 local form
watch(
  () => props.reportValue,
  (v) => {
    if (v) {
      form.value = {
        stock: { stockId: v.stockId ?? '', stockName: v.stockName ?? '' } as StockOption,
        buyPrice: v.buyPrice ?? 0,
        sellPrice: v.sellPrice ?? 0,
        quantity: v.quantity ?? 0,
        buyCost: v.buyCost ?? 0,
        actualRealizedPnl: v.actualRealizedPnl ?? 0,
        stockProfit: v.stockProfit ?? 0,
        tradesDate: v.tradesDate ?? '',
        note: v.note ?? '',
      };
    } else {
      form.value = {
        stock: { stockId: '', stockName: '' },
        buyPrice: 0,
        sellPrice: 0,
        quantity: 0,
        buyCost: 0,
        actualRealizedPnl: 0,
        stockProfit: 0,
        tradesDate: '',
        note: '',
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
