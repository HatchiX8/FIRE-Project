<template>
  <n-card title="個人資料" class="bg-backgroundSurface flex flex-col rounded-2xl px-0">
    <loadingAreaOverlay :loadingId="userProfileStore.userInfoLoading" class="px-0">
      <div v-show="!isInfoProfileLoading">
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
            <p>姓名 : {{ userProfileStore.userInfo.name }}</p>
            <p>暱稱 : {{ userProfileStore.userInfo.nickname }}</p>
            <p>{{ memberTypeText }}</p>
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
      </div>
    </loadingAreaOverlay>
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
// store
import { userInfoProfileStore } from '@/stores/index';
import { useAreaLoadingStore } from '@/components/modules/loadingModule/store/index';
// ---------------------------

// ----------初始化----------
const userProfileStore = userInfoProfileStore();
const loadingStore = useAreaLoadingStore(); // 讀取狀態 store

const isInfoProfileLoading = computed(() =>
  loadingStore.isLoading(userProfileStore.userInfoLoading)
);

const memberTypeText = computed(() => {
  const role = userProfileStore.userInfo.role;
  if (role === 'guest') return '體驗會員';
  if (role === 'user') return '一般會員';
  if (role === 'admin') return '管理員';
  return '體驗會員';
});

onMounted(async () => {
  await userProfileStore.fetchUserInfoData();
});
// -------------------------

// ----------編輯資料-----------
const isEditing = ref(false);

const form = computed(() => ({
  nickname: userProfileStore.userInfo.nickname,
  email: userProfileStore.userInfo.email,
}));

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
