<template>
  <div>
    <van-action-sheet v-model="show" class="content" closeable title="回复评论">
      <div>
        <van-cell>
          <div class="con">
            <van-image round fit="cover" class="image" :src="item.aut_photo" />
            <div class="info">
              <h3>{{ item.aut_name }}</h3>
              <div>{{ item.content }}</div>
              <div class="btm">
                <span class="time">{{ item.pubdate | filterMoment }}</span>
              </div>
            </div>
            <div class="i-con">
              <span>{{ item.like_count }} </span>
              <van-icon name="like-o" />
            </div>
          </div>
        </van-cell>
      </div>
      <van-divider>回复</van-divider>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="i in list" :key="i.com_id">
          <div class="con">
            <van-image round fit="cover" class="image" :src="i.aut_photo" />
            <div class="info">
              <h3>{{ i.aut_name }}</h3>
              <div>{{ i.content }}</div>
              <div class="btm">
                <span class="time">{{ i.pubdate | filterMoment }}</span>
              </div>
            </div>
            <div class="i-con">
              <span>{{ i.like_count }} </span>
              <van-icon name="like-o" />
            </div>
          </div>
        </van-cell>
      </van-list>
      <van-tabbar>
        <van-field v-model="channels" center clearable placeholder="请输入回复">
          <template #button>
            <van-button size="small" type="primary" @click="replay">回复</van-button>
          </template>
        </van-field>
      </van-tabbar>
    </van-action-sheet>
  </div>
</template>

<script>
import { filterMoment } from '@/utils/filterMoment'
import { getCommentsAPI, addCommentsAPI } from '@/api/comment.js'

export default {
  filters: { filterMoment },

  data() {
    return {
      show: false,
      item: {},
      channels: '',
      loading: false,
      finished: false,
      list: [],
    }
  },
  methods: {
    onLoad() {
      // 获取评论数据
      getCommentsAPI({
        type: 'c',
        source: this.item.com_id,
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

    // 重新载入
    reload() {
      this.show = true
      this.finished = false
      this.list = []
    },

    // 回复按钮点击事件(发送回复)
    replay() {
      if (this.channels.trim()) {
        addCommentsAPI({
          target: this.item.com_id,
          content: this.channels,
          art_id: this.$route.params.article_id,
        }).then((res) => {
          this.list.unshift(res.new_obj)
          this.item.reply_count++

          // this.$emit()
          console.log(res)
          this.channels = ''
        })
      } else {
        this.$toast('请输入回复内容')
      }
    },
  },
}
</script>

<style lang="less" scoped>
.content {
  padding: 0 0 60px;
}
</style>
