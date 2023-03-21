<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow title="小思同学" @click-left="$router.back()"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div ref="chatList" class="chat-list">
      <div v-for="(item, index) in list" :key="index">
        <!-- 左侧是机器人小思 -->
        <div v-if="item.name == 'server'" class="chat-item left">
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="chat-pao">{{ item.msg }}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div v-else :key="index" class="chat-item right">
          <div class="chat-pao">{{ item.msg }}</div>
          <van-image fit="cover" round :src="$store.state.users.userProfile.photo" />
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container">
      <van-field v-model.trim="word" clearable clickable autofocus placeholder="说点什么..." @keyup.enter="send">
        <template #button>
          <van-button type="primary" @click="send()">提交</van-button>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'

let socket = null

export default {
  name: 'Chat',
  data() {
    return {
      // 用户输入的聊天内容
      word: '',
      list: [
        { name: 'user', msg: '客服端' },
        { name: 'server', msg: '服务器' },
      ],
    }
  },
  watch: {
    list() {
      // 监视到 list 数据变化后，等 DOM 更新完毕，再执行滚动到底部的操作
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
  },
  activated() {
    this.$nextTick(() => {
      this.scrollToBottom()
    })
  },
  created() {
    if (!this.$store.state.users.userProfile.photo) {
      this.$store.dispatch('users/getProfile')
    }
    socket = io('/ws', {
      query: {
        token: this.$store.state.users.token.token,
      },
      transports: ['websocket'],
    })
    // 建立连接的事件
    socket.on('connect', () => console.log('connect: websocket 连接成功！'))

    // 关闭连接的事件
    socket.on('disconnect', () => console.log('disconnect: websocket 连接关闭！'))

    // 接收到消息的事件
    socket.on('message', (msg) => {
      this.list.push({ name: 'server', msg })
    })

    // // 接收到消息的事件
    // socket.on('message', (msg) => {
    //   // 把服务器发送过来的消息，存储到 list 数组中
    //   this.list.push({ name: 'xs', msg })
    // })
  },
  // 组件被销毁之前，清空 sock 对象
  beforeDestroy() {
    // 关闭连接
    socket.close()

    // 销毁 websocket 实例对象
    socket = null
  },
  methods: {
    // 提交按钮的点击事件处理函数
    send() {
      // 如果输入的聊天内容为空，则 return 出去
      if (!this.word) return
      // 向服务器发送消息
      socket.emit('send', {
        msg: this.word,
        timestamp: new Date().getTime(),
      })
      // 将用户填写的消息存储到 list 数组中
      this.list.push({ name: 'me', msg: this.word })
      // 清空文本框中的消息内容
      this.word = ''
    },
    searchInput() {
      //
    },

    // 滚动到页面底部
    scrollToBottom() {
      this.$refs.chatList.scrollTo({
        top: this.$refs.chatList.scrollHeight,
        behavior: 'smooth',
      })
      // 1. 获取到所有的聊天 Item 项
      // const chatItem = document.querySelectorAll('.chat-item')
      // // 2. 获取到最后一项对应的 DOM 元素
      // const lastItem = chatItem[chatItem.length - 1]
      // // 3. 滚动元素的父容器，使被调用 scrollIntoView() 的元素对用户可见
      // lastItem.scrollIntoView({
      //   behavior: 'smooth',
      //   // 定义垂直方向的对齐（end 表示元素的底端将和其所在滚动区的可视区域的底端对齐）
      //   block: 'end',
      // })
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 46px 0 50px;
  background: #fafafa;

  .chat-list {
    height: 100%;
    overflow-y: scroll;

    .chat-item {
      padding: 10px;

      .van-image {
        width: 40px;
        height: 40px;
        vertical-align: top;
      }

      .chat-pao {
        position: relative;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        padding: 0 10px;
        font-size: 14px;
        line-height: 38px;
        color: #333;
        word-break: break-all;
        vertical-align: top;
        background-color: #e0effb;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;

        &::before {
          position: absolute;
          top: 12px;
          width: 10px;
          height: 10px;
          content: '';
          background: #e0effb;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
        }
      }
    }
  }
}

.chat-item.right {
  text-align: right;

  .chat-pao {
    margin-right: 15px;
    margin-left: 0;

    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}

.chat-item.left {
  text-align: left;

  .chat-pao {
    margin-right: 0;
    margin-left: 15px;

    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}

::v-deep .van-field__body {
  height: 40px;
  background: #f5f5f5;
  border-radius: 8px;
}

::v-deep .van-field__control {
  text-indent: 1em;
}

.reply-container {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  background: #f5f5f5;
}
</style>
