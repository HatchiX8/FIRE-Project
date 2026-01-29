<template>
  <baseDialog
    v-model="visible"
    title="編輯歷史紀錄"
    :ok-loading="loading"
    @ok="handleSubmit"
    :disabled="disableSubmit"
  >
    <n-form ref="formRef" :model="form" :rules="rules" label-width="80">
      <n-form-item label="股票代碼" class="w-90%">
        <n-input :value="reportValue.stockName" disabled />
      </n-form-item>
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
        path="sellCost"
        :component="NInputNumber"
        v-model="form.sellCost"
        class="w-90%"
        :component-props="{ placeholder: '請輸入賣出後總應收付(含稅)' }"
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
        label="實際損益"
        path="realizedPnl"
        :component="NInputNumber"
        v-model="form.realizedPnl"
        class="w-90%"
        :component-props="{ placeholder: '請輸入實際損益' }"
      />
      <baseForm
        label="備註"
        path="note"
        :component="NInput"
        v-model="form.sellNote"
        class="w-90%"
        :component-props="{
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 6 },
          maxlength: 200,
          showCount: true,
          placeholder: '請輸入備註（可留空）',
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
import type { StockRow, EditReportPayload } from '../api/index';
// 元件
import { baseDialog, baseForm } from '@/components/index';
// 商業邏輯
import { nonNegative, integerOnly, ymdValidator } from '@/utils/index';
// ---------------------------

// ----------props&emit----------
const props = defineProps<{
  reportValue: StockRow;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submitEditReport', payload: { reportId: string | null; formValue: EditReportPayload }): void;
}>();
// ------------------------------

// ----------彈窗運作----------
const visible = defineModel<boolean>({ required: true }); // 是否顯示彈窗

const formRef = ref<FormInst | null>(null); // 表單實例
// 表單資料
const form = ref({
  stockId: '',
  sellPrice: 0,
  sellQty: 0,
  sellCost: 0,
  realizedPnl: 0,
  sellDate: '',
  sellNote: '',
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
// 當父層傳入 reportValue 時把資料複製到 local form
watch(
  () => props.reportValue,
  (v) => {
    if (v) {
      form.value = {
        stockId: v.stockId,
        sellPrice: v.sellPrice ?? 0,
        sellQty: v.sellQty ?? 0,
        sellCost: v.sellCost ?? 0,
        realizedPnl: v.realizedPnl ?? 0,
        sellDate: v.sellDate ?? '',
        sellNote: v.sellNote ?? '',
      };
    } else {
      form.value = {
        stockId: '',
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
  emit('submitEditReport', { reportId: props.reportValue.stockId, formValue: form.value });
};

// ---------------------------
</script>
