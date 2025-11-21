<template>
  <baseDialog
    v-model="visible"
    title="編輯資產"
    :ok-loading="submitting"
    @ok="handleSubmit"
    @cancel="reset"
  >
    <n-form ref="formRef" :model="form" :rules="rules" label-width="80">
      <n-form-item label="股票代碼" class="w-90%">
        <n-input :value="stockLabel" disabled />
      </n-form-item>
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
        label="買進成本"
        path="buyCost"
        :component="NInputNumber"
        v-model="form.buyCost"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="買進日期"
        path="buyDate"
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
import type { StockRow, StockOption, EditReportPayload } from '../api/index';
// 元件
import { baseDialog, baseForm } from '@/components/index';
// 商業邏輯
import { useStockLabel } from '@/utils/index';
// ---------------------------

// ----------props&emit----------
const props = defineProps<{
  reportValue: StockRow;
}>();

const emit = defineEmits<{
  (e: 'submitEditReport', payload: { reportId: string | null; formValue: EditReportPayload }): void;
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
  quantity: 0,
  buyCost: 0,
  tradesDate: '',
  note: '',
});
// ---------------------------

// ----------表單驗證----------

const rules: FormRules = {
  note: [{ required: false, trigger: ['input', 'blur'] }],
};

// ---------------------------

// ----------表單事件----------
// 當父層傳入 assetValue 時把資料複製到 local form
watch(
  () => props.reportValue,
  (v) => {
    if (v) {
      form.value = {
        stock: { stockId: v.stockId ?? '', stockName: v.stockName ?? '' } as StockOption,
        buyPrice: v.buyPrice ?? 0,
        quantity: v.quantity ?? 0,
        buyCost: v.buyCost ?? 0,
        tradesDate: v.tradesDate ?? '',
        note: v.note ?? '',
      };
    } else {
      form.value = {
        stock: { stockId: '', stockName: '' },
        buyPrice: 0,
        quantity: 0,
        buyCost: 0,
        tradesDate: '',
        note: '',
      };
    }
  },
  { immediate: true }
);

const { stockLabel } = useStockLabel(computed(() => form.value.stock));

// 提交表單
const handleSubmit = async () => {
  const payload: EditReportPayload = {
    // 不包含 stockId / stockName 等多餘欄位
    note: form.value.note ?? '',
  };

  emit('submitEditReport', { reportId: props.reportValue.stockId, formValue: payload });
};

// 表單重置
function reset() {
  // 可清空或還原
}
// ---------------------------
</script>
