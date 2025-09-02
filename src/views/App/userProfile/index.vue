<template>
  <n-card title="個人資料" class="bg-backgroundSurface mt-5 flex flex-col rounded-2xl">
    <div class="flex items-center justify-center">
      <div>
        <n-space align="flex-end">
          <n-avatar
            round
            :size="72"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
        </n-space>
      </div>
      <div class="text-textColor ml-6 flex flex-col gap-2">
        <p>王大明</p>
        <p>Teacher ID : 123456</p>
        <p>體驗會員</p>
      </div>
      <div class="mb-auto ml-auto">
        <baseButton color="primary" @click="toggleEdit">
          {{ isEditing ? '完成' : '編輯資料' }}</baseButton
        >
      </div>
    </div>
    <div v-if="isEditing" class="mt-4">
      <p>暱稱 :</p>
      <n-input v-model:value="form.nickname" placeholder="輸入暱稱" />
    </div>
    <div class="mt-4">
      <p>電子郵件 :</p>
      <template v-if="isEditing">
        <n-input v-model:value="form.email" placeholder="輸入電子郵件" />
      </template>
      <template v-else>
        <p>{{ form.email }}</p>
      </template>
    </div>

    <div class="mt-6 flex justify-center gap-4">
      <baseButton color="primary" @click="accUpgrade">帳號升級</baseButton>
      <baseButton color="primary">資金投入/提領</baseButton>
    </div>
  </n-card>
  <accUpgradeDialog v-model="openAccUpgradeDialog" />
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
// 元件
import { baseButton } from '@/components/index';
import accUpgradeDialog from './comps/accUpgradeDialog.vue';
// 商業邏輯
// ---------------------------

// ----------編輯資料-----------
const isEditing = ref(false);

const form = ref({
  nickname: '王大明',
  email: 'test@gmail.com',
});

const toggleEdit = () => {
  isEditing.value = !isEditing.value;

  if (!isEditing.value) {
    console.log('送出資料:', form.value);
  }
};

const openAccUpgradeDialog = ref(false);
// ----------------------------

const accUpgrade = () => {
  openAccUpgradeDialog.value = true;
};
</script>
