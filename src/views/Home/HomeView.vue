<template>
  <div>
    <van-nav-bar>
      <template #right>
        <van-search v-model="search" shape="round" placeholder="请输入搜索关键词" @focus="$router.push('/search')" />
      </template>
      <template #left>
        <van-image
          height="80%"
          width="80%"
          fit="contain"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAAclBMVEUAAADl5eXn5+fl5eXq6uro6Ojm5ubj4+Pk5OTt7e3p6enj4+Pn5+ff39/i4uL/////Nzzr6+v/zc7/UFT/5uf/aWz/tLb/m53/goX/REj/XGD/8vP/qKr/jpH/2tr/dXn/wML/goTx8fH19fX/m57/tLW8xwRAAAAAD3RSTlMAXyCf78+/QKDv34B/EFBAdW3pAAADr0lEQVRo3u2a7XaiMBCGg59tt3Ykk5DwTdW9/1vcatARBjFVck737D7/2oPvE5JJnELFFZtovlzET/K6nEczMcR6Fe9hEvbxfM3iZ6sdTMhu3ruLaLGHaXmLrvPfdzA5u3eWH8wQUf60ho92fd8gEAu30i8Qiv3qVP87CMZuTTcQhpUQsxgCEm9EtIeA7COaoTDMxRKCshSvEJSFiCEo8dSCXCkpk6QwxtpaZ4hPCVQ/bcshgXdaeTvNX6BUJZs2TWscTPMXtGnmnJZuJ0RQWhhE7+f/gskEaKmwgggUQKJ7Tsx0/flZmgL9BenpQ3ywxu2W0pgiSaRUSsEVelzAgyybIGBMK1CPCiqZFOZTZzguMPCogK7JK4m3BAjPCIijoBgSSDjCz7CsageH/oLkMiLCQkuC3YnL2/xs+5wAKxhQaAUOhdsHBcSBLmpqFy+hRaajOznNdF2a49YZEBCoSKESXV7i89L/qEhpPd2kspvgSPzuWSTbyeJgAgwa/jMCUkjWs8ii1qNrAHlvL7u5HppAXVTg4JrGZONVRNvFlTYLL2UOo1jfMnV10rmGh1fqYQG62uDLQqjD16RntlEPCbTbTExA6bRFsDZS3RNUqiso4YgZFshDdvmqzC7LU5tG5l0B28vW7WU8H6Y1F6iibstRO1k/hQk4tzayrApLnx8UpOgpSOHWNugL1LGZSJJGVkqxNbiNZaM7VoxrTaiZYHgLUDrBOS0HSFiZ+gvSU9tkKI3znMBCl58lyCvZsD+vHhV0mwkqBIafoJOGKS/Tbwjyy9istdV5yGOkV4LsuAdyyPGGYLg7VOmNCnY7Sl3fQQNDNyPG8t1wCrc/O61FcjkPSYBtZdceAnNdbSXdTG+9ii0J6MI8vSv4DY5D54AuaOqVUyIJ2IUjgrSh/BNZv2k2dH8kuJokPSrAivK7gVW3fa94mfLZ5AJULN9NCX21tXeITMAniQsynu9SKNPSBUyA7XMZvCWw+XAXWABVo+pMQ3banAf6MhttHUtw5Nb9zOrm6/e1OziyrR9iqPxz/mlkT3keENTtMaRZlC9/08OQf0eQTipARK2PXZO59GCxeDqNOjqOr8B10Pc6On8B4v0ezF/A0n7403cuWEBQXoO/Ygn+kij8a65N2Bd1MyFWEJB54Jel8Vp8sQq3CnP3wjrYVnibiRMfoV65R6LlVxDD7pcQZAiTT0RvMC37xYfoMHuJJx3+aib6rF+m++eZ1VoMMYtelq/xkyyW82gjiD8U9zbr32NaBwAAAABJRU5ErkJggg=="
        />
      </template>
    </van-nav-bar>
    <van-tabs v-model="active" swipeable @change="changTab">
      <van-button icon="plus" @click="show = true" />
      <ArticleList v-if="myChannels.length" ref="list" :active="active" :my-channels="myChannels"></ArticleList>
    </van-tabs>
    <van-popup v-model="show" round closeable close-icon="close" position="bottom" :style="{ height: '80%' }" @close="$refs.popupChannels.showBadge = false">
      <popupChannels
        ref="popupChannels"
        v-model="active"
        :my-channels="myChannels"
        :all-channels="allChannels"
        @showPop="show = false"
        @removeChannels="removeChannels"
        @addChannels="addChannels"
      ></popupChannels>
    </van-popup>
  </div>
</template>

<script>
import ArticleList from '@/components/ArticleList.vue'
import { allChannelsAPI, userChannelsAPI, addChannelsAPI } from '@/api/channels'
import popupChannels from '@/components/popupChannels.vue'

export default {
  name: 'Home',
  components: { ArticleList, popupChannels },
  data() {
    return {
      search: '',
      show: false,
      active: 0,
      allChannels: [],
      myChannels: [],
    }
  },
  // 初始化获取全部频道和个人频道
  async created() {
    const { token } = this.$store.state.users.token
    const localChannel = JSON.parse(localStorage.getItem('channel'))
    if (token || !localChannel) {
      const data = await userChannelsAPI()
      this.myChannels = data.channels
    } else {
      this.myChannels = localChannel
    }
    const res = await allChannelsAPI()
    this.allChannels = res.channels
  },
  methods: {
    // 频道切换事件
    changTab() {
      this.$refs.list.switchTab()
    },
    // 改变index频道
    activeTab(id) {
      this.active = id
      this.changTab()
    },
    // 删除单个频道(无网络请求)
    removeChannels(index) {
      this.myChannels.splice(index, 1)

      // await removeChannelsAPI(id);
      // const res = await userChannelsAPI();
      // this.myChannels = res.channels;
    },
    // 增加单个频道(无网络请求)
    addChannels(item) {
      this.myChannels.push(item)
      // await addChannelsAPI({
      //   channels: [...this.sendChannels, { id: item.id, seq: this.myChannels.length }],
      // });
    },
  },
}
</script>
<style scoped lang="less">
::v-deep .van-tabs__nav {
  margin-right: 44px;
}

::v-deep .van-tabs {
  position: relative;

  .van-button {
    position: absolute;
    top: 0;
    right: 0;
    width: 44px;
    height: 44px;
    border: none;
  }
}

.van-search {
  height: 100%;
}
</style>
