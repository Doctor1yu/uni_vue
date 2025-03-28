<template>
    <view class="container">
        <view class="form-container">
            <!-- 学号 -->
            <view class="info-item">
                <text class="label">学号</text>
                <text class="value">{{ studentId }}</text>
            </view>

            <!-- 原密码 -->
            <view class="password-container">
              <input class="input" placeholder="请输入原密码" v-model="form.oldPassword" :type="showOldPassword ? 'text' : 'password'" />
              <view class="eye-icon" @click="showOldPassword = !showOldPassword">
                <image :src="showOldPassword ? eye_show : eye_hide" style="width: 60rpx; height: 60rpx;" />
              </view>
            </view>

            <!-- 新密码 -->
            <view class="password-container">
              <input class="input" placeholder="请输入新密码(6~20位)" v-model="form.newPassword" :type="showNewPassword ? 'text' : 'password'" />
              <view class="eye-icon" @click="showNewPassword = !showNewPassword">
                <image :src="showNewPassword ? eye_show : eye_hide" style="width: 60rpx; height: 60rpx;" />
              </view>
            </view>

            <!-- 确认密码 -->
            <view class="password-container">
              <input class="input" placeholder="请确认新密码(6~20位)" v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" />
              <view class="eye-icon" @click="showConfirmPassword = !showConfirmPassword">
                <image :src="showConfirmPassword ? eye_show : eye_hide" style="width: 60rpx; height: 60rpx;" />
              </view>
            </view>

            <!-- 提交按钮 -->
            <view class="submit-btn" @click="handleSubmit">确认修改</view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user'; // 导入用户 store
import { changePassword } from '@/utils/api'; // 导入更改密码接口

const userStore = useUserStore();

// 从 userStore 中获取学号
const studentId = ref(userStore.userInfo.studentId || ''); // 如果 userInfo 为空，显示空字符串

const form = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const eye_show = ref("http://stm89m2wy.hd-bkt.clouddn.com/uni/icon/eye_show.png")
const eye_hide = ref("http://stm89m2wy.hd-bkt.clouddn.com/uni/icon/eye_hide.png")

// 保存
const handleSubmit = async () => {
    if (!form.value.oldPassword) {
        uni.showToast({
            title: '请输入原密码',
            icon: 'none'
        });
        return;
    }
    if (!form.value.newPassword) {
        uni.showToast({
            title: '请输入新密码',
            icon: 'none'
        });
        return;
    }
    if (form.value.newPassword !== form.value.confirmPassword) {
        uni.showToast({
            title: '两次密码不一致',
            icon: 'none'
        });
        return;
    }

    try {
        // 调用更改密码接口
        const response = await changePassword(
            studentId.value,
            form.value.oldPassword,
            form.value.newPassword,
            form.value.confirmPassword
        );

        if (response.code === 0) {
            uni.showToast({
                title: '密码修改成功',
                icon: 'success'
            });

             // 更新 userStore 中的用户信息
            userStore.userInfo.password = form.value.newPassword;

            // 1秒后跳转到个人中心界面
            setTimeout(() => {
                uni.switchTab({
                    url: '/pages/myZone/myZone'
                });
            }, 1000);
        } else {
            // 打印失败时的响应数据
            console.log('失败响应数据:', response);
            uni.showToast({
                title: response.data?.message || '密码修改失败',
                icon: 'none'
            });
        }
    } catch (error) {
        console.error('保存失败:', error);
        uni.showToast({
            title: '网络错误，请重试',
            icon: 'none'
        });
    }
};
</script>

<style scoped>
.container {
    padding: 20rpx;
}

.form-container {
    margin-top: 50rpx;
}

.info-item {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background: #fff;
    border-bottom: 1rpx solid #eee;
}

.label {
    font-size: 32rpx;
    color: #333;
    margin-right: 20rpx;
}

.value {
    font-size: 32rpx;
    color: #666;
}

.input {
    background: #fff;
    border: 1rpx solid #ddd;
    border-radius: 8rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
}

.submit-btn {
    background-color: #007AFF;
    color: #fff;
    text-align: center;
    padding: 20rpx;
    border-radius: 8rpx;
    font-size: 32rpx;
    margin-top: 40rpx;
}

.password-container {
  position: relative;
  margin-bottom: 20rpx;
}

.eye-icon {
  position: absolute;
  right: 20rpx;
  top: 60%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 40rpx;
}
</style>
