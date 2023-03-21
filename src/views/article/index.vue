<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <van-nav-bar fixed placeholder :title="content.title" left-arrow @click-left="onClickLeft" />
    <h2 class="title">{{ content.title }}</h2>
    <!-- 作者信息 -->

    <div class="aut-box">
      <van-image class="avatar" round fit="cover" :src="content.aut_photo" />
      <div class="info-box">
        <div>{{ content.aut_name }}</div>
        <span>{{ content.pubdate | filterMoment }}</span>
      </div>
      <van-button round type="info" size="small">+ 关注</van-button>
    </div>

    <!-- 内容区域 -->
    <div class="content" v-html="content.content"></div>

    <Comments :id="$route.params.article_id"></Comments>
  </div>
</template>

<script>
import { profileAPI } from '@/api/article'
import { filterMoment } from '@/utils/filterMoment'
import Comments from '@/components/Comments.vue'

export default {
  filters: {
    filterMoment,
  },
  components: { Comments },
  data() {
    return {
      key: this.$route.params,
      content: {},
      channels: '',
    }
  },
  async created() {
    this.content = await profileAPI(this.$route.params.article_id)
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
      console.log()
    },
  },
}
</script>

<style lang="less" scoped>
.title {
  margin: 15px;
  font-size: 18px;
}

.content {
  padding: 0 20px;
  padding-bottom: 46px;
  overflow: hidden;
  font-size: 16px;
  word-wrap: break-word;
  white-space: pre-wrap;

  ::v-deep pre {
    padding: 10px;
    margin: 0 0 1.75em;
    word-wrap: break-word;
    white-space: pre-wrap;
    background: #fafafa;
    border: 1px solid #d1d1d1;
    // border: 1px dotted #000;
    // line-height: 200%;
    // color: #fff;
    .hljs-keyword {
      color: #3794ff;
    }

    .hljs-title {
      color: #ce6700;
    }

    .hljs-string {
      color: #c5c800;
    }

    .hljs-built_in {
      color: red;
    }

    .hljs-comment {
      color: gray;
    }

    .hljs-number {
      color: #3794ff;
    }

    .copy-code-btn {
      // padding: 4px;
      color: white;
      background: #ff2929;
      // border-radius: 10px;
    }

    img {
      width: 100%;
    }

    ::v-deep figcaption {
      font-size: 24px;
    }
  }

  ::v-deep h2,
  h3 {
    font-size: 24px;
    font-weight: 900;
  }
}

.aut-box {
  display: flex;
  align-items: center;
  margin: 15px;

  .avatar {
    width: 80px;
    height: 80px;
  }

  .info-box {
    flex: 1;
    margin-left: 10px;
    font-size: 16px;

    div {
      margin-bottom: 10px;
    }

    span {
      font-size: 14px;
      color: grey;
    }
  }
}
</style>
