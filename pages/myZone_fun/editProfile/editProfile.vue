<template>
    <view class="container">
        <view class="form-container">
            <!-- 头像 -->
            <view class="avatar-container">
                <image class="avatar" :src="form.avatarUrl || defaultAvatar"></image>
            </view>

            <!-- 学号（只显示，不可编辑） -->
            <view class="info-item">
                <text class="label">学号</text>
                <text class="value">{{ studentId }}</text>
            </view>

            <!-- 昵称 -->
            <input class="input" placeholder="请输入昵称" v-model="form.nickName" />

            <!-- 手机号 -->
            <input class="input" placeholder="请输入手机号" v-model="form.phoneNumber" />

            <!-- 提交按钮 -->
            <view class="submit-btn" @click="handleSubmit">保存</view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user'; // 导入用户 store
import { updateProfile } from '@/api/user'; // 导入更新用户信息接口

const userStore = useUserStore();

// 从 userStore 中获取学号
const studentId = ref(userStore.userInfo.studentId || ''); // 如果 userInfo 为空，显示空字符串
const defaultAvatar = ref('http://stm89m2wy.hd-bkt.clouddn.com/uni/avatarUrl/avatar1.png');

const form = ref({
    avatarUrl: userStore.userInfo.avatarUrl || '', // 从 userStore 中获取头像
    nickName: userStore.userInfo.nickName || '',
    phoneNumber: userStore.userInfo.phoneNumber || ''
});

// 保存
const handleSubmit = async () => {
    if (!form.value.nickName) {
        uni.showToast({
            title: '请输入昵称',
            icon: 'none'
        });
        return;
    }
    if (!form.value.phoneNumber) {
        uni.showToast({
            title: '请输入手机号',
            icon: 'none'
        });
        return;
    }

    try {

        // 调用更新用户信息接口
        const response = await updateProfile(
            userStore.userInfo.studentId,
            form.value.nickName,
            form.value.phoneNumber
        );

        if (response.data.code === 0) {
            uni.showToast({
                title: '保存成功',
                icon: 'success'
            });

            // 更新 userStore 中的用户信息
            userStore.userInfo.nickName = form.value.nickName;
            userStore.userInfo.phoneNumber = form.value.phoneNumber;

            // 1秒后跳转到个人中心界面
            setTimeout(() => {
                uni.switchTab({
                    url: '/pages/myZone/myZone'
                });
            }, 1000);
        } else {
            uni.showToast({
                // title: response.data.message || '保存失败',
                title:  '保存失败',
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

.avatar-container {
    text-align: center;
    margin-bottom: 40rpx;
}

.avatar {
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
    border: 4rpx solid #ddd;
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
</style>