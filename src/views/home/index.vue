<template>
  <div class="home">
    <van-nav-bar fixed>
      <template #left>
        <img style="height: 85%;" src="@/assets/image/logo.png" alt="" />
      </template>
      <template #right>
        <van-button icon="search" round class="searchBtn" to="/search"
          >搜索</van-button
        >
      </template>
    </van-nav-bar>
    <div class="tab-area">
      <van-tabs v-model="currentIndex" class="tabs">
        <van-tab :title="item.name" v-for="item in channelsList" :key="item.id">
          <ArticleList :channel_id="item.id"></ArticleList>
        </van-tab>
        <div class="chanBtn">
          <van-icon name="wap-nav" @click="showChannel" />
        </div>
      </van-tabs>
    </div>
    <!-- 频道管理 -->
    <Channel
      ref="channel"
      :list="channelsList"
      :currentIndex="currentIndex"
      @delChannel="delChannel"
      @addChannel="addChannel"
      @setIndex="currentIndex = $event"
    ></Channel>
  </div>
</template>

<script>
import ArticleList from '@/views/home/components/articleList.vue'
import Channel from './components/channel.vue'
import { userChannels, setChannel } from '@/api/channel'
export default {
  name: 'Home',
  components: { ArticleList, Channel },
  data () {
    return {
      currentIndex: 0,
      channelsList: JSON.parse(localStorage.getItem('channel')) || []
    }
  },
  created () {
    this.getChannelList()
  },
  methods: {
    async getChannelList () {
      const res = await userChannels()
      // console.log('频道列表', res)
      this.channelsList = res.data.data.channels
      this.setChannel()
    },
    showChannel () {
      this.$refs.channel.show = true
    },
    // 删除频道
    delChannel (index) {
      this.channelsList.splice(index, 1)
      this.setChannel()
      if (this.currentIndex > index) {
        this.currentIndex--
      }
    },
    addChannel (item) {
      this.channelsList.push(item)
      this.setChannel()
    },
    async setChannel () {
      localStorage.setItem('channels', JSON.stringify(this.channelsList))
      if (this.$store.state.token.token) {
        const _list = this.channelsList.map((item, index) => {
          return {
            id: item.id,
            seq: index
          }
        })
        await setChannel({ channels: _list })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  padding-top: 46px;
  .searchBtn {
    height: 70%;
    background-color: rgba(255, 255, 255, 0.3);
    border: 0;
    .van-button__text {
      color: #fff;
    }
  }

  .tab-area {
    .tabs {
      padding-right: 40px;
      .chanBtn {
        position: absolute;
        top: 0;
        right: 0;
        width: 40px;
        height: 40px;
        padding: 5px;
        .van-icon {
          font-size: 30px;
        }
      }
    }
  }
}
</style>
