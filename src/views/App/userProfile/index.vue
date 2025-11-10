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
            <baseButton color="primary" @click="isEditing ? submitEdit() : startEdit()">
              {{ isEditing ? '完成' : '編輯資料' }}
            </baseButton>
          </div>
        </div>

        <div v-if="isEditing" class="mt-4">
          <p>暱稱 :</p>
          <n-input v-model:value="editForm.nickname" placeholder="輸入暱稱" />
        </div>

        <div class="mt-4">
          <p>電子郵件 :</p>
          <template v-if="isEditing">
            <n-input v-model:value="editForm.email" placeholder="輸入電子郵件" />
          </template>
          <template v-else>
            <p>{{ form.email }}</p>
          </template>
        </div>

        <div class="mt-6 flex justify-center gap-4">
          <baseButton v-if="memberTypeText !== '管理員'" color="primary" @click="accUpgrade"
            >帳號升級</baseButton
          >
          <baseButton v-else color="primary" @click="goToAdminPage">會員管理</baseButton>
          <baseButton color="primary">資金投入/提領</baseButton>
        </div>
      </div>
    </loadingAreaOverlay>
  </n-card>
  <accUpgradeDialog
    v-model="openAccUpgradeDialog"
    :userName="userProfileStore.userInfo.name"
    @submit-upgrade="submitUpgrade"
    @close-dialog="openAccUpgradeDialog = false"
  />
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
const loadingStore = useAreaLoadingStore();
const router = useRouter();

// 讀取狀態
const isInfoProfileLoading = computed(() =>
  loadingStore.isLoading(userProfileStore.userInfoLoading)
);

// 帳號權限類型
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

// ----------props&emit----------
// const emit = defineEmits<{
//   (e: 'update-profile', payload: updateUserInfoPayload): void;
// }>();
// ------------------------------

// ----------編輯資料-----------
const isEditing = ref(false);

// 表單資料
const form = computed(() => ({
  nickname: userProfileStore.userInfo.nickname,
  email: userProfileStore.userInfo.email,
  avatar_url: userProfileStore.userInfo.avatar_url,
}));

// 編輯表單資料
const editForm = ref<{ nickname: string; email: string; avatar_url: string | null }>({
  nickname: '',
  email: '',
  avatar_url: null,
});

// 開始編輯
const startEdit = () => {
  editForm.value.nickname = userProfileStore.userInfo.nickname;
  editForm.value.email = userProfileStore.userInfo.email;
  editForm.value.avatar_url = userProfileStore.userInfo.avatar_url ?? null;
  isEditing.value = true;
};

// 送出編輯
const submitEdit = async () => {
  isEditing.value = false;

  if (!isEditing.value) {
    await userProfileStore.editUpdateUserInfoData(editForm.value); // 直接呼叫 store 方法
  }
};

const openAccUpgradeDialog = ref(false);
// ----------------------------

// ----------帳號升級----------
// 開啟帳號升級對話框
const accUpgrade = () => {
  openAccUpgradeDialog.value = true;
};

// 送出帳號升級請求
const submitUpgrade = async (payload: { note: string }) => {
  await userProfileStore.sendAccountUpgradeRequest(payload.note);
  // 在這裡處理帳號升級的邏輯，例如呼叫 API 等
};
// ---------------------------

// ----------管理員事件----------
// 前往會員管理頁面
const goToAdminPage = () => {
  router.push('/App/adminPage');
};
// -----------------------------
</script>
