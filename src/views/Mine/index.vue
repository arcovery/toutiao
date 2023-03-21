<template>
  <div>
    <div class="contact">
      <van-image class="img" round fit="cover" width="2.5rem" height="2.5rem" :src="userProfile.photo" />
      <div class="box">
        <h4>{{ userProfile.name }}</h4>
        <span>{{ userProfile.birthday }}</span>
      </div>
    </div>
    <van-grid :border="false" :column-num="3">
      <van-grid-item icon="newspaper-o" text="我的作品" />
      <van-grid-item icon="star-o" text="我的收藏" />
      <van-grid-item icon="tosend" text="阅读历史" />
    </van-grid>
    <van-cell-group>
      <van-cell v-for="(item, index) in cell" :key="index" :title="item" is-link @click="cellClick(item)" />
    </van-cell-group>
    <van-popup v-model="show">内容</van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MineView',
  data() {
    return {
      show: false,
      cell: ['编辑设置', '小智同学', '系统设置', '退出登录'],
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
  computed: {
    ...mapState('users', ['userProfile']),
  },
  created() {
    this.$store.dispatch('users/getProfile')
  },
  methods: {
    async onSubmit() {
      this.isLoading = true
      await this.$store.dispatch('users/login', this.info)
      this.isLoading = false
    },
    cellClick(item) {
      switch (item) {
        case '退出登录':
          this.$store.dispatch('users/resetState')
          this.$toast.success('退出成功')
          break
        case '编辑设置':
          this.$router.push('mine/editor')
          break
        case '系统设置':
          this.show = true
          break
        case '小智同学':
          this.show = true
          break

        default:
          break
      }
    },
  },
}
</script>
<style lang="less" scoped>
.contact {
  display: flex;
  align-items: center;
  height: 120px;
  background-color: #3296fa;

  .img {
    margin: 0 10px;
  }

  h4 {
    margin-bottom: 10px;
    font-size: 24px;
    color: #fff;
  }

  span {
    font-size: 16px;
    color: #3296fa;
    background-color: #fff;
  }
}
</style>
