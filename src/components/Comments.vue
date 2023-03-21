<template>
  <div class="comments">
    <div>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="item in list" :key="item.com_id">
          <div class="con">
            <van-image round fit="cover" class="image" :src="item.aut_photo" />
            <div class="info">
              <h3>{{ item.aut_name }}</h3>
              <div>{{ item.content }}</div>
              <div class="btm">
                <span class="time">{{ item.pubdate | filterMoment }}</span>
                <van-button type="default" size="mini" @click="showReply(item)">{{ item.reply_count }} 回复</van-button>
              </div>
            </div>
            <div class="i-con">
              <span>{{ item.like_count }} </span>
              <van-icon name="like-o" />
            </div>
          </div>
        </van-cell>
      </van-list>
    </div>
    <ReplyComments ref="Reply"></ReplyComments>
    <van-tabbar>
      <van-field v-model="channels" center clearable placeholder="请输入评论">
        <template #button>
          <van-button size="small" type="primary" @click="addComments">评论</van-button>
        </template>
      </van-field></van-tabbar
    >
  </div>
</template>

<script>
import { filterMoment } from '@/utils/filterMoment'
import ReplyComments from '@/components/ReplyComments.vue'
import { getCommentsAPI, addCommentsAPI } from '@/api/comment.js'

export default {
  name: 'Comments',
  components: { ReplyComments },
  filters: { filterMoment },
  data() {
    return {
      loading: false,
      finished: false,
      list: [],
      offset: null,
      limit: null,
      channels: '',
    }
  },
  methods: {
    // 回复评论
    showReply(item) {
      this.$refs.Reply.item = item
      console.log(this.$refs.Reply)
      this.$refs.Reply.reload()
    },
    onLoad() {
      // 获取评论数据
      getCommentsAPI({
        type: 'a',
        source: this.$route.params.article_id,
        offset: this.offset,
      }).then((res) => {
        this.list.push(...res.results)
        this.offset = res.last_id
        console.log(res)
        this.loading = false
        if (res.end_id === res.last_id) {
          this.finished = true
        }
      })
    },

    // 评论按钮点击事件(发送评论)
    addComments() {
      //
      if (this.channels.trim()) {
        addCommentsAPI({
          target: this.$route.params.article_id,
          content: this.channels,
        }).then((res) => {
          this.list.unshift(res.new_obj)
          console.log(res)
          this.channels = ''
        })
      } else {
        this.$toast('请输入评论内容')
      }
    },
  },
  //
}
</script>

<style lang="less" scoped>
.comments {
  margin-bottom: 80px;

  .van-button {
    vertical-align: middle;
  }

  ::v-deep .con {
    display: flex;
    justify-self: start;

    .image {
      width: 50px;
      height: 50px;
      margin-left: 20px;
    }

    .info {
      flex: 1;
      margin-left: 10px;
    }

    .i-con {
      margin-right: 10px;
    }
  }
}
</style>
