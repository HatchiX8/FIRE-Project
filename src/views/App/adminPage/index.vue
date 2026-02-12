<template>
  <div class="md:(px-4 mx-auto) max-w-6xl">
    <upgradeTable :tableData="adminPageStore.upgradeList" @review="requestReview" />
    <memberTable :tableData="adminPageStore.memberList" @review="requestMemberStatus" />
  </div>
  <!-- Upgrade Dialog -->
  <baseDialog
    v-model="upgradeConfirmVisible"
    :title="upgradeConfirmTitle"
    :ok-loading="upgradeConfirmLoading"
    :width="'80%'"
    @ok="handleUpgradeConfirm"
    @cancel="resetUpgradeDialog"
  >
    <p class="text-center">{{ upgradeConfirmMessage }}</p>
  </baseDialog>

  <!-- Member Dialog -->
  <baseDialog
    v-model="memberConfirmVisible"
    :title="memberConfirmTitle"
    :ok-loading="memberConfirmLoading"
    :width="'80%'"
    @ok="handleMemberConfirm"
    @cancel="resetMemberDialog"
  >
    <p class="text-center">{{ memberConfirmMessage }}</p>
  </baseDialog>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
// MemberAction
import type { ReviewAction, MemberAction } from './api/index';
// 元件
import upgradeTable from './comps/upgradeTable.vue';
import memberTable from './comps/memberTable.vue';
import { baseDialog } from '@/components/index';
// 商業邏輯
import { notify } from '@/utils/index';
// store
import { useAdminPageStore } from '@/stores/modules/adminPage/store';
// ---------------------------

// ----------確認窗狀態----------
type UpgradePayload = { id: string; action: ReviewAction };
type MemberPayload = { id: string; action: MemberAction };

// Upgrade dialog state
const upgradeConfirmVisible = ref(false);
const upgradeConfirmLoading = ref(false);
const upgradeTargetId = ref<string | null>(null);
const upgradeTargetAction = ref<ReviewAction | null>(null);

// Member dialog state
const memberConfirmVisible = ref(false);
const memberConfirmLoading = ref(false);
const memberTargetId = ref<string | null>(null);
const memberTargetAction = ref<MemberAction | null>(null);

// 申請者審核確認窗操作
const upgradeConfirmTitle = computed(() => {
  if (upgradeTargetAction.value === 'approved') return '確認通過';
  if (upgradeTargetAction.value === 'rejected') return '確認未通過';
  return '確認操作';
});

const upgradeConfirmMessage = computed(() => {
  if (upgradeTargetAction.value === 'approved') return '該申請者是否要通過審核？';
  if (upgradeTargetAction.value === 'rejected') return '該申請者是否要拒絕通過審核？';
  return '確定要執行此操作嗎？';
});

// 會員資格確認窗操作
const memberConfirmTitle = computed(() => {
  if (memberTargetAction.value === 'downgrade') return '確認降級';
  if (memberTargetAction.value === 'ban') return '確認停權';
  return '確認操作';
});

const memberConfirmMessage = computed(() => {
  if (memberTargetAction.value === 'downgrade') return '是否要將該會員降級為訪客？';
  if (memberTargetAction.value === 'ban') return '是否要停權該帳號？';
  return '確定要執行此操作嗎？';
});
// ------------------------

// ----------初始化-----------
const adminPageStore = useAdminPageStore();

const requestUserUpgradeList = async () => {
  await adminPageStore.fetchUserUpgradeList();
};

const requestUserMemberList = async () => {
  await adminPageStore.fetchUserMemberList();
};

onMounted(async () => {
  await requestUserUpgradeList();
  await requestUserMemberList();
});
// -------------------------

// ----------彈窗事件----------
// Upgrade Table 審核按鈕點擊事件
const requestReview = async (payload: UpgradePayload) => {
  upgradeTargetId.value = payload.id;
  upgradeTargetAction.value = payload.action;
  upgradeConfirmVisible.value = true;
};
// Member Table 狀態操作按鈕點擊事件
const requestMemberStatus = async (payload: MemberPayload) => {
  memberTargetId.value = payload.id;
  memberTargetAction.value = payload.action;
  memberConfirmVisible.value = true;
};
// 重置 Upgrade 確認彈窗狀態
const resetUpgradeDialog = () => {
  upgradeConfirmVisible.value = false;
  upgradeConfirmLoading.value = false;
  upgradeTargetId.value = null;
  upgradeTargetAction.value = null;
};
// 重置 Member 確認彈窗狀態
const resetMemberDialog = () => {
  memberConfirmVisible.value = false;
  memberConfirmLoading.value = false;
  memberTargetId.value = null;
  memberTargetAction.value = null;
};

// Upgrade 確認彈窗「確認」按鈕事件
const handleUpgradeConfirm = async () => {
  if (!upgradeTargetId.value || !upgradeTargetAction.value) return;

  upgradeConfirmLoading.value = true;

  const res = await adminPageStore.reviewUserUpgrade(upgradeTargetId.value, {
    status: upgradeTargetAction.value, // approved/rejected
    userNote: '',
  });

  if (!res.success) {
    notify('error', res.message);
    upgradeConfirmLoading.value = false;
    return;
  }
  notify('success', res.message);
  await Promise.all([requestUserUpgradeList(), requestUserMemberList()]);
  resetUpgradeDialog();
};

// Member 確認彈窗「確認」按鈕事件
const handleMemberConfirm = async () => {
  if (!memberTargetId.value || !memberTargetAction.value) return;

  memberConfirmLoading.value = true;

  const res = await adminPageStore.userAccountActivation(memberTargetId.value, {
    status: memberTargetAction.value, // downgrade/ban
    userNote: '',
  });

  if (!res.success) {
    notify('error', res.message);
    memberConfirmLoading.value = false;
    return;
  }
  notify('success', res.message);
  await requestUserMemberList();
  resetMemberDialog();
};
// ---------------------------
</script>
