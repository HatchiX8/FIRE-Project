<template>
  <baseDialog
    v-model="visible"
    title="刪除資產"
    :ok-loading="submitting"
    @ok="handleSubmit"
    @cancel="reset"
  >
    <n-form ref="formRef" :model="form" label-width="80">
      <baseForm
        label="股票代碼"
        path="name"
        :component="NInput"
        v-model="form.name"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="總成本"
        path="buyCost"
        :component="NInputNumber"
        v-model="form.buyCost"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="總市值"
        path="marketValue"
        :component="NInput"
        v-model="form.marketValue"
        class="w-90%"
        :component-props="{ disabled: true }"
      />
      <baseForm
        label="未實現損益(%)"
        path="profitRate"
        :component="NInputNumber"
        v-model="form.profitRate"
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
import { NInput, NInputNumber } from 'naive-ui';
// 共用型別
import type { FormInst } from 'naive-ui';
// 元件
import { baseDialog, baseForm } from '@/components/index';
// 商業邏輯
// ---------------------------

// ----------彈窗運作----------
const visible = defineModel<boolean>({ required: true }); // 是否顯示彈窗
const submitting = ref(false); // 送出時的讀取狀態
const formRef = ref<FormInst | null>(null); // 表單實例
// 表單資料
const form = ref({
  id: '',
  name: '',
  buyCost: null,
  marketValue: '',
  profitRate: 0,
  note: '',
});
// ---------------------------

// ----------表單事件----------
// 提交表單
const handleSubmit = async () => {
  console.log('往外emit去觸發請求API');
};

// 表單重置
function reset() {
  // 可清空或還原
}
// ---------------------------
</script>
