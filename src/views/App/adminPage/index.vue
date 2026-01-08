<template>
  <div class="md:(px-4 mx-auto) max-w-6xl">
    <upgradeTable :tableData="adminPageStore.upgradeList" @review="requestReview" />
    <memberTable :tableData="adminPageStore.memberList" @review="requestMemberStatus" />
  </div>

  <baseDialog
    v-model="confirmVisible"
    :title="confirmTitle"
    :ok-loading="confirmLoading"
    :width="'80%'"
    @ok="handleConfirm"
    @cancel="handleCancel"
  >
    <p class="text-center">
      {{ confirmMessage }}
    </p>
  </baseDialog>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
import type { ReviewAction } from './api/index';
// 元件
import upgradeTable from './comps/upgradeTable.vue';
import memberTable from './comps/memberTable.vue';
import { baseDialog } from '@/components/index';
// 商業邏輯
// store
import { useAdminPageStore } from '@/stores/modules/adminPage/store';
// ---------------------------

// ----------type----------

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
  console.log('檢視表格資料', adminPageStore.upgradeList);
  console.log('檢視表格資料', adminPageStore.memberList);
});
// -------------------------

// ----------彈跳視窗----------

const confirmVisible = ref(false);
const confirmLoading = ref(false);

const targetId = ref<string | null>(null);
const targetAction = ref<ReviewAction | null>(null);

// Dialog 標題 & 內容
const confirmTitle = computed(() => {
  if (targetAction.value === 'approved') return '確認通過';
  if (targetAction.value === 'rejected') return '確認未通過';
  return '確認操作';
});

const confirmMessage = computed(() => {
  if (targetAction.value === 'approved') {
    return '該申請者是否要通過審核?';
  }
  if (targetAction.value === 'rejected') {
    return '該申請者是否要拒絕通過審核?';
  }
  return '確定要執行此操作嗎？';
});

// 子元件 emit 'review' 之後會進到這裡
const requestReview = async (payload: { id: string; action: ReviewAction }) => {
  targetId.value = payload.id;
  targetAction.value = payload.action;
  confirmVisible.value = true;
  const res = await adminPageStore.reviewUserUpgrade(payload.id, {
    status: payload.action,
    adminNote: '', // 可擴充註記內容
  });

  if (!res.success) {
    // 操作失敗錯誤處理
  } else {
    // 操作成功後，重抓兩個列表
    await Promise.all([requestUserUpgradeList(), requestUserMemberList()]);
    resetConfirmState();
  }
};

// 子元件 emit 'review' 之後會進到這裡
const requestMemberStatus = async (payload: { id: string; action: ReviewAction }) => {
  targetId.value = payload.id;
  targetAction.value = payload.action;
  confirmVisible.value = true;
  // 明天改成呼叫會員審核的 store 方法
  const res = await adminPageStore.reviewUserUpgrade(payload.id, {
    status: payload.action,
    adminNote: '', // 可擴充註記內容
  });

  if (!res.success) {
    // 操作失敗錯誤處理
  } else {
    // 操作成功後，重抓兩個列表
    // await Promise.all([requestUserUpgradeList(), requestUserMemberList()]);
    requestUserMemberList();
    resetConfirmState();
  }
};

const resetConfirmState = () => {
  confirmVisible.value = false;
  confirmLoading.value = false;
  targetId.value = null;
  targetAction.value = null;
};

const handleCancel = () => {
  resetConfirmState();
};

const handleConfirm = async () => {
  if (!targetId.value || !targetAction.value) {
    return;
  }

  confirmLoading.value = true;
  console.log('觸發操作', targetId.value, targetAction.value);

  // try {
  // 呼叫 store 的審核 API
  //   const res = await adminPageStore.reviewMember({
  //     id: targetId.value,
  //     action: targetAction.value,
  //   });

  //   if (res.status) {
  //     window.$message?.success(res.message ?? '操作成功');
  //     // ✅ 操作成功後，重抓兩個列表
  //     await Promise.all([requestUserUpgradeList(), requestUserMemberList()]);
  //     resetConfirmState();
  //   } else {
  //     window.$message?.error(res.message ?? '操作失敗');
  //     // 失敗就不要關 dialog，讓使用者可以再操作 or 取消
  //     confirmLoading.value = false;
  //   }
  // } catch (err) {
  //   window.$message?.error('系統錯誤，請稍後再試');
  setTimeout(() => {
    resetConfirmState();
  }, 2000);

  // }
};
// ---------------------------
</script>
