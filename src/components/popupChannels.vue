<template>
  <div>
    <van-nav-bar title="编辑频道" />
    <div class="title">
      <span>我的频道</span>
      <van-button v-if="!showBadge" size="small" color="linear-gradient(to right, #ff6034, #ee0a24)" @click="showBdg">编辑</van-button>
      <van-button v-else size="small" color="linear-gradient(to right, #0087fc, #009cef)" @click="saveList">保存</van-button>
    </div>
    <van-grid :border="false">
      <van-grid-item v-for="(item, index) in myChannels" :key="index">
        <van-badge color="none">
          <van-button :color="active === index ? 'red' : ''" class="child" type="default" @click="removeChannels(index)">{{ item.name }}</van-button>

          <template #content>
            <van-icon v-show="showBadge" color="#000" name="cross" class="badge-icon animate__animated animate__infinite" :class="{ animate__heartBeat: showBadge }" />
          </template>
        </van-badge>
      </van-grid-item>
    </van-grid>
    <div class="title">
      <span>可选频道</span>
    </div>
    <van-grid v-if="myChannels.length" :class="{ opt: !showBadge }" :border="false">
      <van-grid-item v-for="(item, index) in optionalChannels" :key="index" class="animate__animated animate__infinite" :class="{ animate__swing: showBadge }">
        <van-badge color="transparent">
          <van-button class="child animate__animated animate__infinite" :class="{ animate__heartBeat: showBadge }" type="default" @click="addChannels(item)">{{ item.name }}</van-button>
          <template #content>
            <van-icon v-show="showBadge" color="#0095ff" name="plus" class="badge-icon" />
          </template>
        </van-badge>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { addChannelsAPI } from '@/api/channels'

export default {
  name: 'PopupChannels',
  model: {
    // 改父传子默认名字
    prop: 'active',
  },
  props: {
    allChannels: {
      type: Array,
      required: true,
    },
    myChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showBadge: false,
      isFirst: true,
    }
  },
  computed: {
    // 可选频道
    optionalChannels() {
      return this.allChannels.filter((i) => !this.myChannels.find((v) => v.name === i.name))
    },
    // 频道数据,顺序重排
    sendChannels() {
      return this.myChannels.map((e, i) => {
        return { id: e.id, seq: i }
      })
    },
  },
  watch: {
    myChannels() {
      if (this.isFirst) {
        this.isFirst = false
        return
      }
      const { token } = this.$store.state.users.token
      if (token) {
        addChannelsAPI({ channels: [...this.sendChannels] })
      } else {
        localStorage.setItem('channel', JSON.stringify(this.myChannels))
      }
    },
  },

  methods: {
    // 频道微标显示隐藏
    showBdg() {
      this.showBadge = !this.showBadge
    },
    // 删除单个频道(无网络请求)
    removeChannels(index) {
      if (this.showBadge) {
        this.$emit('removeChannels', index)
        if (this.active > index) {
          this.$emit('input', this.active - 1)
        }
      } else {
        this.$emit('input', index)
        this.$emit('showPop')
      }
    },
    // 增加单个频道(无网络请求)
    addChannels(item) {
      if (this.showBadge) {
        this.$emit('addChannels', item)
      }
    },
    // 保存频道列表
    saveList() {
      this.showBdg()
    },
  },
}
</script>

<style lang="less" scoped>
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  font-size: medium;
}

.child {
  // width: 40px;
  // height: 40px;
  font-size: 14px;
  line-height: 1;
  text-align: center;
  // background: #f2f3f5;
  background: transparent;
  border-radius: 4px;
}

.van-grid {
  overflow: hidden;
}

.opt {
  opacity: 0.5;
}

.active {
  color: red;
}

::v-deep .van-badge {
  min-width: 0;
  padding: 0;
}
</style>
