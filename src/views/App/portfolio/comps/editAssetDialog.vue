<template>
  <baseDialog
    v-model="visible"
    title="編輯資產"
    :ok-loading="loading"
    @ok="handleSubmit"
    :disabled="disableSubmit"
  >
    <n-form ref="formRef" :model="form" :rules="rules" label-width="80">
      <n-form-item label="股票代碼" class="w-90%">
        <n-input :value="assetValue.stockName" disabled />
      </n-form-item>

      <baseForm
        label="買進價格"
        path="buyPrice"
        :component="NInputNumber"
        v-model="form.buyPrice"
        class="w-90%"
      />
      <baseForm
        label="持有股數"
        path="quantity"
        :component="NInputNumber"
        v-model="form.quantity"
        class="w-90%"
      />
      <baseForm
        label="總成本"
        path="buyCost"
        :component="NInputNumber"
        v-model="form.buyCost"
        class="w-90%"
      />
      <baseForm
        label="日期"
        path="buyDate"
        :component="NInput"
        v-model="form.buyDate"
        class="w-90%"
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
import type { EditStockPayload, StockRow } from '../api/index';
// 元件
import { baseDialog, baseForm } from '@/components/index';
// 商業邏輯
import { nonNegative, integerOnly, ymdValidator } from '@/utils/index';
// ---------------------------

// ----------props&emit----------
const props = defineProps<{
  assetValue: StockRow;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submitEditAsset', payload: { assetId: string | null; formValue: EditStockPayload }): void;
}>();
// ------------------------------

// ----------彈窗運作----------
const visible = defineModel<boolean>({ required: true }); // 是否顯示彈窗
const formRef = ref<FormInst | null>(null); // 表單實例
// 表單資料
const form = ref<EditStockPayload>({
  stockId: '',
  buyPrice: 0,
  quantity: 0,
  buyCost: 0,
  buyDate: '',
  note: '',
});

const disableSubmit = computed(
  () =>
    form.value.buyPrice <= 0 || // ← 改檢查值是否有效
    form.value.quantity <= 0 ||
    form.value.buyCost <= 0 ||
    !form.value.buyDate
);
// ---------------------------

// ----------表單驗證----------
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
// 重置表單到原始狀態
const resetForm = () => {
  if (props.assetValue) {
    form.value = {
      stockId: props.assetValue.stockId ?? '',
      buyPrice: props.assetValue.buyPrice ?? 0,
      quantity: props.assetValue.quantity ?? 0,
      buyCost: props.assetValue.totalCost ?? 0,
      buyDate: props.assetValue.buyDate ?? '',
      note: props.assetValue.note ?? '',
    };
  } else {
    form.value = {
      stockId: '',
      buyPrice: 0,
      quantity: 0,
      buyCost: 0,
      buyDate: '',
      note: '',
    };
  }
};

// Watch 1️⃣：父層傳入新資產時
watch(() => props.assetValue, resetForm, { immediate: true });

// Watch 2️⃣：彈窗關閉時重置
watch(
  () => visible.value,
  (isOpen) => {
    if (!isOpen) {
      resetForm();
      formRef.value?.validate().catch(() => {});
    }
  }
);

// 提交表單
const handleSubmit = async () => {
  emit('submitEditAsset', { assetId: props.assetValue.assetId, formValue: form.value });
};

// ---------------------------
</script>
