<template>
  <div>
    <KeepAlive>
      <router-view />
    </KeepAlive>
    <van-tabbar v-model="active" route>
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/chat" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item to="/mine" icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      active: '',
    }
  },
  activated() {
    console.log('%c Line:24 🥥', 'color:#ed9ec7', 'layout路由activated激活')
  },
}
</script>
