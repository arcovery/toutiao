<template>
  <div>
    <van-nav-bar title="标题" left-arrow @click-left="$router.back()" />
    <van-form @submit="onSubmit">
      <van-field v-model="info.mobile" name="手机号" label="手机号" placeholder="手机号" :rules="rules.mobile" />
      <van-field v-model="info.code" type="code" name="验证码" label="验证码" placeholder="验证码" :rules="rules.code" />
      <div style="margin: 16px">
        <van-button block :loading="isLoading" type="info" loading-text="正在登录" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      info: {
        mobile: '13217876267',
        code: '246810',
        active: 2,
      },
      isLoading: false,
      rules: {
        mobile: [
          { required: true, message: '请填写手机号' },
          { pattern: /^(?:(?:\+|00)86)?1\d{10}$/, message: '请填写正确的手机号' },
        ],
        code: [
          { required: true, message: '请填写验证码' },
          {
            pattern: /^\S*(?=\S{6,})(?=\S*\d)\S*$/,
            message: '请填写6位正确的验证码',
          },
        ],
      },
    }
  },
  methods: {
    async onSubmit() {
      this.isLoading = true
      this.info.back = this.$route.query.back
      await this.$store.dispatch('users/login', this.info)
      this.isLoading = false
    },
  },
}
</script>
<!-- <style lang="less">
.van-nav-bar__content {
  background: #3196fa;

  .van-nav-bar__title {
    color: white;
  }
}
</style> -->
