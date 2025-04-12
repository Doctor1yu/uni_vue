<script>

</script>

<script setup>
import { onLaunch } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

onLaunch(() => {
	// 初始化用户状态
	userStore.initUserState();
});
</script>

<template>
  <view>
    <view v-if="userStore.isLoggedIn">
      欢迎回来，{{ userStore.userInfo.studentId }}
    </view>
    <view v-else>
      请登录
    </view>
  </view>
</template>

<style>
	/*每个页面公共css */
</style>
