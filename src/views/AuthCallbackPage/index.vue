<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <h1 class="text-xl font-semibold">{{ loadingText }}</h1>
      <p v-if="errorText" class="mt-2 text-sm opacity-80">{{ errorText }}</p>
      <p v-else class="mt-2 text-sm opacity-80">Please wait...</p>
    </div>
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
// 元件
// 商業邏輯
import { notify } from '@/utils/index';
// store
import { useUserStore } from '@/stores/index';
// ---------------------------

// ----------初始化----------
const userStore = useUserStore();
const router = useRouter();
// const route = useRoute();

const loadingText = ref('登入中...請稍後');
const errorText = ref<string | null>(null);

onMounted(async () => {
  try {
    await userStore.requestRefreshCookie();

    if (userStore.token) {
      userStore.setToken(userStore.token);
    }

    const loginCheckResult = await userStore.requestLoginCheck();

    if (loginCheckResult.success) {
      const user = loginCheckResult.data?.user;
      const displayName = user?.nickname && user.nickname !== '' ? user.nickname : user?.name;
      console.log('登入成功,使用者為:', displayName);
      notify('success', `Hi${displayName}，歡迎使用！`);
      router.replace('/App');
    } else {
      console.log('登入失敗');
      notify('error', `登入失敗，請重新登入`);
      router.replace('/Landing/home');
      return;
    }
  } catch {
    router.replace('/Landing/home');
    return;
  }
});
// -------------------------
</script>
