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
import { computed, reactive, ref, watch } from 'vue';
import { NInputNumber } from 'naive-ui';
import type { FormInst, FormRules } from 'naive-ui';

type Mode = 'deposit' | 'withdraw';

const visible = defineModel<boolean>({ required: true });

const props = defineProps<{
  currentInvest: number;
  loading?: boolean; // 父層 API 進行中傳進來 → 綁到 ok-loading
  initialMode?: Mode; // 可選，預設 'deposit'
}>();

const emit = defineEmits<{
  (e: 'submit', payload: { mode: Mode; amount: number }): void;
  (e: 'cancel'): void;
}>();

const mode = ref<Mode>(props.initialMode ?? 'deposit');
const isDeposit = computed(() => mode.value === 'deposit');
const isWithdraw = computed(() => mode.value === 'withdraw');

const dialogTitle = computed(() => (isDeposit.value ? '投入' : '提領'));
const amountLabel = computed(() => (isDeposit.value ? '投入金額' : '提領金額'));

const formRef = ref<FormInst | null>(null);
const form = reactive({ amount: 0 as number });

const rules: FormRules = {
  amount: [
    { required: true, type: 'number', message: '請輸入金額', trigger: ['input', 'blur'] },
    {
      validator: (_r, v: number) => (v > 0 ? true : new Error('金額需 > 0')),
      trigger: ['input', 'blur'],
    },
    {
      // 提領不得超過當前投資金
      validator: (_r, v: number) =>
        isWithdraw.value
          ? v <= props.currentInvest
            ? true
            : new Error('不得超過當前投資金')
          : true,
      trigger: ['input', 'blur'],
    },
  ],
};

function formatAmount(n: number) {
  return n.toLocaleString('zh-TW');
}

async function onOk() {
  await formRef.value?.validate();
  emit('submit', { mode: mode.value, amount: Number(form.amount) });
}

function onCancel() {
  emit('cancel');
  reset();
}

function reset() {
  mode.value = props.initialMode ?? 'deposit';
  form.amount = 0;
  formRef.value?.restoreValidation();
}

// 每次開窗重置（也可改為開窗時帶入草稿值）
watch(visible, (v) => {
  if (v) reset();
});

const loading = computed(() => props.loading === true);
</script>
