<!-- eslint-disable vue/valid-v-for -->
<template>
  <div id="search">
    <van-nav-bar title="搜索中心" left-text="返回" left-arrow @click-left="$router.back()" />
    <van-popover v-model="showSearch" get-container="#search" placement="bottom" trigger="click">
      <van-cell v-for="item in actions" :key="item" style="width: 100vw" clickable :title="item" icon="search" @click="onSelect(item)">
        <template #right-icon> <van-icon name="back-top" class="search-icon" /> </template
      ></van-cell>
      <van-cell v-if="Array.from(searchHistory).length" class="history" icon="clock-o" color="red" title="历史记录" @click="clearHistory">
        清空<van-icon name="delete" color="red" class="search-icon"
      /></van-cell>
      <van-cell v-for="item in searchHistory" icon="clock-o" :title="item" style="width: 100vw" clickable @click="onSelect(item)">
        <template #right-icon> <van-icon name="back-top" class="search-icon" /> </template
      ></van-cell>
      <template #reference>
        <van-search v-model="search" class="search" shape="round" placeholder="请输入搜索关键词" show-action @keyup.enter="onRefresh" @input="searchInput">
          <template #action>
            <div @click="onRefresh">搜索</div>
          </template></van-search
        >
      </template>
    </van-popover>
    <!-- 上拉刷新组件 -->
    <van-pull-refresh ref="pullRefresh" v-model="refreshing" class="article-list" @refresh="onRefresh">
      <!-- 内容列表 -->
      <van-list v-model="loading" :finished="finished" :immediate-check="false" :offset="50" finished-text="没有更多了" @load="onLoad">
        <van-cell-group v-for="(val, e) in list" :key="e" @click="$router.push(`/article/${val.art_id}`)">
          <van-cell>
            <div style="font-size: larger; font-weight: bold">{{ val.title }}</div>
            <van-grid :border="false" column-num="3">
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
  </div>
</template>

<script>
import { searchAPI, suggestionAPI } from '@/api/search'
import { filterMoment } from '@/utils/filterMoment'

export default {
  name: 'Search',
  filters: {
    filterMoment,
  },
  data() {
    return {
      search: '',
      actions: [],
      timer: null,
      loading: false,
      finished: false,
      list: [],
      showSearch: false,
      showList: false,
      refreshing: false,
      page: 1,
      per_page: null,
      searchHistory: JSON.parse(localStorage.getItem('searchHistory')) || new Set([]),
    }
  },
  // 进入缓存组件时添加滚动监听
  activated() {
    console.log('进入缓存组件')
    this.$refs.pullRefresh.$el.scrollTop = this.scrollTop
    this.$refs.pullRefresh.$el.addEventListener('scroll', this.handlerScroll)
  },

  // 离开缓存组件时移除滚动事件
  deactivated() {
    console.log('离开缓存组件')
    this.$refs.pullRefresh.$el.removeEventListener('scroll', this.handlerScroll)
  },
  methods: {
    clearHistory() {
      localStorage.removeItem('searchHistory')
      this.searchHistory = new Set([])
    },
    // 搜索框输入事件
    searchInput(e) {
      if (this.search.trim()) {
        this.showSearch = true
        clearTimeout(this.timer)
        this.timer = setTimeout(async () => {
          const res = await suggestionAPI({
            q: e,
          })
          if (res.options[0] === null) {
            this.actions = []
          } else {
            this.actions = res.options
          }
          clearTimeout(this.timer)
          this.timer = null
        }, 350)
      } else {
        clearTimeout(this.timer)
        this.actions = []
        this.showSearch = false
      }
    },
    // 搜索按钮点击事件
    async onSearch() {
      // 利用Set 对象存储的值总是唯一的特性去重
      this.searchHistory = new Set([this.search, ...this.searchHistory])
      localStorage.setItem('searchHistory', JSON.stringify(Array.from(this.searchHistory)))
      setTimeout(() => {
        this.showSearch = false
      }, 0)
      this.showList = true
      try {
        const res = await searchAPI({
          page: this.page,
          q: this.search,
        })
        if (res.results.length) {
          this.finished = false
          this.list.push(...res.results)
        } else {
          this.finished = true
        }
      } catch (error) {
        this.finished = true
      }
      this.loading = false
      this.refreshing = false
    },
    clickSearch() {},
    // 搜索提示补全点击事件
    onSelect(item) {
      this.showSearch = false
      this.search = item
      this.list = []
      this.onSearch()
      //
    },

    // 获取并存储当前 scrollTop
    handlerScroll(e) {
      this.scrollTop = e.target.scrollTop
    },
    // 搜索列表加载
    onLoad() {
      this.page += 1
      this.onSearch()
      //
    },
    // 上拉刷新
    onRefresh() {
      if (this.search.trim()) {
        this.finished = true
        this.page = 1
        this.list = []
        this.onSearch()
      } else {
        this.refreshing = false
      }

      //
    },
  },
}
</script>

<style lang="less" scoped>
::v-deep {
  .van-nav-bar__text {
    color: white;
  }

  .van-popover__content {
    margin-top: -10px;
    box-shadow: none;
  }

  .van-popover__arrow {
    display: none;
  }

  .van-popover__wrapper {
    display: block;
  }

  .van-popup {
    display: contents;
  }
}

.history .van-cell__value {
  color: red;
}

.article-list {
  position: fixed;
  top: 90px;
  bottom: 0;
  width: 100vw;
  padding-bottom: 50px;
  overflow: auto;
  scroll-behavior: smooth;
}

#search {
  height: 100vh;
}
</style>
