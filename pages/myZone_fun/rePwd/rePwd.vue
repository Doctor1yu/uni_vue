<template>
    <view class="container">
        <view class="form-container">
            <!-- 学号 -->
            <view class="info-item">
                <text class="label">学号</text>
                <text class="value">{{ studentId }}</text>
            </view>

            <!-- 原密码 -->
            <input class="input" placeholder="请输入原密码" v-model="form.oldPassword" type="password" />

            <!-- 新密码 -->
            <input class="input" placeholder="请输入新密码" v-model="form.newPassword" type="password" />

            <!-- 确认密码 -->
            <input class="input" placeholder="请确认新密码" v-model="form.confirmPassword" type="password" />

            <!-- 提交按钮 -->
            <view class="submit-btn" @click="handleSubmit">确认修改</view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue';

// 假设学号从父组件或全局状态传入
const studentId = ref('20230001'); // 这里可以替换为实际的学号

const form = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});

// 保存
const handleSubmit = () => {
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

    uni.showToast({
        title: '修改成功',
        icon: 'success'
    });

    // 1秒后跳转到个人中心界面
    setTimeout(() => {
        uni.switchTab({
            url: '/pages/myZone/myZone'
        });
    }, 1000);
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
</style>
