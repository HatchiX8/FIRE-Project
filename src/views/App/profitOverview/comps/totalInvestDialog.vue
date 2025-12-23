<template>
  <baseDialog
    v-model="visible"
    :title="dialogTitle"
    :ok-loading="loading"
    @ok="onOk"
    @cancel="onCancel"
  >
    <!-- 操作切換 -->
    <div class="mb-3 flex gap-2">
      <n-button :type="isDeposit ? 'primary' : 'default'" @click="mode = 'deposit'">投入</n-button>
      <n-button :type="isWithdraw ? 'primary' : 'default'" @click="mode = 'withdraw'"
        >提領</n-button
      >
    </div>

    <!-- 當前投資金 -->
    <div class="text-textColor mb-3">當前投資金：{{ formatAmount(currentInvest) }}</div>

    <n-form ref="formRef" :model="form" :rules="rules" label-width="96">
      <baseForm
        :label="amountLabel"
        path="amount"
        :component="NInputNumber"
        v-model="form.amount"
        class="w-90%"
        :component-props="{ min: 0, step: 100, precision: 0, placeholder: '輸入金額' }"
      />
    </n-form>
  </baseDialog>
</template>

<script setup lang="ts">
// ----------import----------
// 套件
import { NInputNumber } from 'naive-ui';
// 共用型別
import type { FormInst, FormRules } from 'naive-ui';
// 元件
// 商業邏輯
// ---------------------------

// ----------props&emit----------
const props = defineProps<{
  currentInvest: number;
  loading?: boolean; // 父層 API 進行中傳進來 → 綁到 ok-loading
  initialMode?: Mode; // 可選，預設 'deposit'
}>();

const emit = defineEmits<{
  (e: 'submit', payload: { mode: Mode; amount: number }): void;
  (e: 'cancel'): void;
}>();
// ------------------------------

// ----------狀態判定----------
type Mode = 'deposit' | 'withdraw'; // 操作模式
const visible = defineModel<boolean>({ required: true }); // 是否顯示彈窗

const mode = ref<Mode>(props.initialMode ?? 'deposit'); // 當前操作模式
const isDeposit = computed(() => mode.value === 'deposit'); // 是否為投入模式
const isWithdraw = computed(() => mode.value === 'withdraw'); // 是否為提領模式

const dialogTitle = computed(() => (isDeposit.value ? '投入' : '提領')); // 對話框標題
const amountLabel = computed(() => (isDeposit.value ? '投入金額' : '提領金額')); // 金額欄位標題

const loading = computed(() => props.loading === true);
// ---------------------------

// ----------表單驗證----------
const formRef = ref<FormInst | null>(null); // 表單實例
const form = ref({ amount: 0 as number }); // 表單資料

const rules: FormRules = {
  amount: [
    { required: true, type: 'number', message: '請輸入金額', trigger: ['input', 'blur'] },
    // 金額需 > 0
    {
      validator: (_r, v: number) => {
        if (v > 0) return true;
        return Promise.reject('金額需 > 0');
      },
      trigger: ['input', 'blur'],
    },
    // 提領不得超過當前投資金
    {
      validator: (_r, v: number) => {
        if (!isWithdraw.value) return true;
        if (v <= props.currentInvest) return true;
        return Promise.reject('不得超過當前投資金');
      },
      trigger: ['input', 'blur'],
    },
  ],
};

// ---------------------------

// ----------事件函式----------
// 金額格式化
const formatAmount = (n: number) => n.toLocaleString('zh-TW');

// 確定送出
const onOk = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate(); // 失敗會丟錯
    // ✅ 驗證通過才送出
    emit('submit', { mode: mode.value, amount: Number(form.value.amount) });
  } catch {
    return;
  }
};

// 取消關閉
const onCancel = () => {
  emit('cancel');
  reset();
};

// 重置表單
const reset = () => {
  mode.value = props.initialMode ?? 'deposit';
  form.value.amount = 0;
  formRef.value?.restoreValidation();
};

// 每次開窗重置
watch(visible, (v) => {
  if (v) reset();
});
// ---------------------------
</script>
