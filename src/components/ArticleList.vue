<template>
  <div ref="article" class="article-list">
    <!-- 导航Tabs -->
    <van-tab v-for="(item, index) in myChannels" :key="index" :title="item.name">
      <!-- 上拉刷新组件 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <!-- 内容列表 -->
        <van-list v-model="loading" :finished="finished" :immediate-check="false" :offset="50" finished-text="没有更多了" @load="onLoad">
          <!-- <van-cell-group v-for="(val, e) in articles" :key="e" @click="test"> -->
          <van-cell-group v-for="(val, e) in articles" :key="e" @click="$router.push(`/article/${val.art_id}`)">
            <!-- $router.push(`/article/${val.art_id}`) -->
            <van-cell>
              <div style="font-size: larger; font-weight: bold">{{ val.title }}</div>
              <van-grid :border="false" :column-num="val.cover.type">
                <van-grid-item v-for="(value, index_item) in val.cover.images" :key="index_item">
                  <van-image :src="value" />
                </van-grid-item>
              </van-grid>
              <van-row class="c_bottom">
                <van-col span="8">{{ val.aut_name }}</van-col>
                <van-col span="4">{{ val.comm_count }} 评论</van-col>
                <van-col>{{ val.pubdate | filterMoment }}</van-col>
              </van-row>
            </van-cell>
          </van-cell-group>
        </van-list>
      </van-pull-refresh>
    </van-tab>
  </div>
</template>

<script>
import { filterMoment } from '@/utils/filterMoment'
import { getArticlesAPI } from '@/api/article'

export default {
  name: 'ArticleList',
  filters: {
    filterMoment,
  },
  props: {
    active: {
      type: Number,
      required: false,
      default: 0,
    },
    myChannels: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      articles: [],
      search: '',
      loading: false,
      finished: false,
      timeout: null,
      refreshing: false,
      preTimestamp: Date.now(),
      scrollTop: 0,
    }
  },
  // 进入缓存组件时添加滚动监听
  activated() {
    this.$refs.article.scrollTop = this.scrollTop
    this.$refs.article.addEventListener('scroll', this.handlerScroll)
  },

  // 离开缓存组件时移除滚动监听
  deactivated() {
    this.$refs.article.removeEventListener('scroll', this.handlerScroll)
  },
  // 组件挂载添加滚动事件监听
  async mounted() {
    await this.$nextTick()
    this.$refs.article.addEventListener('scroll', this.handlerScroll)
  },
  // 组件创建获取数据
  created() {
    this.loading = true
    this.getList()
  },
  methods: {
    // 获取并存储当前 scrollTop
    handlerScroll(e) {
      this.scrollTop = e.target.scrollTop
    },

    // 标签内容加载
    onLoad() {
      this.loading = true
      this.getList()
    },
    // 切换标签栏
    switchTab() {
      this.loading = true
      this.articles = []
      this.preTimestamp = Date.now()
      this.getList()
    },
    // 上拉刷新
    onRefresh() {
      this.finished = false
      this.preTimestamp = Date.now()
      this.articles = []
      this.getList()
    },
    // 获取内容数据
    getList() {
      this.timeout && clearTimeout(this.timeout)
      this.timeout = setTimeout(async () => {
        const res = await getArticlesAPI({
          channel_id: this.myChannels[this.active].id,
          timestamp: this.preTimestamp,
        })
        res.pre_timestamp ? ((this.articles = this.articles.concat(res.results)), (this.finished = false)) : (this.finished = true)
        this.loading = false
        this.refreshing = false
        this.preTimestamp = res.pre_timestamp
      }, 250)
    },
  },
}
</script>

<style lang="less" scoped>
.article-list {
  position: fixed;
  top: 90px;
  bottom: 50px;
  width: 100vw;
  overflow: auto;
  scroll-behavior: smooth;
}

.c_bottom {
  font-size: 12px;
  color: #969799;
}
</style>
