<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <van-nav-bar title="编辑资料" :right-text="cropShow ? '裁剪' : ''" left-arrow @click-left="onClickLeft" @click-right="onClickRight" />
    <!-- 头像上传区域 -->
    <div class="avatar-box">
      <van-uploader :after-read="afterRead">
        <van-image :src="userProfile.photo" round fit="cover" />
      </van-uploader>
    </div>
    <!-- cell区域 -->
    <van-cell-group>
      <van-cell title="名称" :value="userProfile.name" is-link @click="editor" />
      <van-cell title="性别" :value="userProfile.gender ? '女' : '男'" is-link @click="showPicker = true" />
      <van-cell
        title="生日"
        :value="userProfile.birthday"
        is-link
        @click="
          showDate = true
          currentDate = new Date(userProfile.birthday)
        "
      />
    </van-cell-group>
    <!-- 裁剪的盒子 -->
    <div v-if="cropShow" class="crop-box">
      <VueCropper ref="cropper" auto-crop :img="img" center-box auto-crop-height="200" auto-crop-width="200"> </VueCropper>
    </div>
    <!-- 编辑昵称弹出框 -->
    <van-dialog v-model="show" title="修改昵称" show-cancel-button @confirm="confirm">
      <van-field ref="field" v-model="username" :rules="[{ required: true, message: '请填写用户名' }]"> </van-field>
    </van-dialog>
    <!-- 性别选择框 -->
    <van-popup v-model="showPicker" position="bottom">
      <van-picker show-toolbar :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
    </van-popup>
    <!-- 生日选择框 -->
    <van-popup v-model="showDate" position="bottom">
      <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate" @confirm="dateConfirm" @cancel="showDate = false" />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper'
import dayjs from 'dayjs'
import { photoAPI, editorProfileAPI } from '@/api/user'

export default {
  name: 'Editor',
  components: {
    VueCropper,
  },
  data() {
    return {
      cropShow: false,
      img: null,
      show: false,
      username: '',
      showPicker: false,
      columns: ['男', '女'],
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: null,
      showDate: false,
    }
  },
  computed: {
    ...mapState('users', ['userProfile']),
  },
  created() {
    this.$store.dispatch('users/getProfile')
  },
  methods: {
    // 日期选择器
    async dateConfirm(value) {
      const data = {
        ...this.userProfile,
        birthday: dayjs(value).format('YYYY-MM-DD'),
      }
      await editorProfileAPI(data)
      this.$store.commit('users/updateUserProfile', data)
      this.showDate = false
    },
    // 性别选择器确认按钮
    async onConfirm(_, index) {
      this.showPicker = false
      const data = {
        ...this.userProfile,
        gender: index,
      }
      await editorProfileAPI(data)
      this.$store.commit('users/updateUserProfile', data)
    },
    // 编辑昵称
    editor() {
      this.show = true
      this.username = this.userProfile.name
      // 增加延时解决无法聚焦bug
      setTimeout(() => {
        this.$refs.field.focus()
      }, 350)
    },
    // 弹窗确认按钮事件
    async confirm() {
      const data = {
        ...this.userProfile,
        name: this.username,
      }
      await editorProfileAPI(data)
      this.$store.commit('users/updateUserProfile', data)
    },
    // 返回按钮点击
    onClickLeft() {
      this.cropShow ? (this.cropShow = false) : this.$router.back()
    },
    // 裁剪按钮点击
    async onClickRight() {
      this.$refs.cropper.getCropBlob(async (data) => {
        const fd = new FormData()
        fd.append('photo', data)
        const res = await photoAPI(fd)
        this.$store.commit('users/updateUserProfile', {
          ...this.userProfile,
          photo: res.photo,
        })
        this.cropShow = false
      })
    },
    // 读取文件操作
    afterRead(file) {
      this.img = file.content
      this.cropShow = true
    },
  },
}
</script>

<style lang="less" scoped>
.avatar-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140px;

  .van-image {
    width: 120px;
    height: 120px;
  }
}

.crop-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
