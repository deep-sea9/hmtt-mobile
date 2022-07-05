<template>
  <div class="articleList" ref="list" @scroll="scroll">
    <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
      <van-list
        v-if="show"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getArticleList"
      >
        <div
          class="item"
          v-for="item in list"
          :key="item.art_id"
          @click="$router.push('/article?art_id=' + item.art_id)"
        >
          <h3>{{ item.title }}</h3>
          <div class="pic">
            <img
              v-for="(img, index) in item.cover.images"
              :key="index"
              :src="img"
              :style="{ width: (1 / item.cover.images.length) * 100 + '%' }"
              alt=""
            />
          </div>
          <div class="info">
            <span class="name">{{ item.aut_name }}</span>
            <span class="comm">{{ item.comm_count }}评论</span>
            <span class="time">{{ item.pubdate | dateFormat }}</span>
            <van-icon name="cross" class="icon" />
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { articles } from '@/api/article'
export default {
  name: 'ArticleList',
  data () {
    return {
      timestamp: Date.now(),
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      refreshLoading: false,
      show: true,
      scrollTop: 0
    }
  },
  props: {
    channel_id: {
      type: Number,
      default: 0
    }
  },
  activated () {
    this.$nextTick(() => {
      this.$refs.list.scrollTop = this.scrollTop
    })
  },
  methods: {
    // 获取文章列表
    async getArticleList () {
      const res = await articles({
        channel_id: this.channel_id,
        timestamp: this.timestamp
      })
      // console.log('文章列表', res)
      this.loading = false
      this.list.push(...res.data.data.results)
      this.timestamp = res.data.data.pre_timestamp
      if (!this.timestamp) {
        this.finished = true
      }
    },
    // 下拉刷新
    onRefresh () {
      this.refreshLoading = false
      this.loading = false
      this.finished = false
      this.list = []
      this.timestamp = Date.now()
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    scroll (e) {
      this.scrollTop = e.target.scrollTop
    }
  }
}
</script>

<style lang="less" scoped>
.articleList {
  position: fixed;
  top: 90px;
  bottom: 50px;
  width: 100vw;
  padding: 15px;
  overflow: auto;
  box-sizing: border-box;
  .item {
    h3 {
      font-size: 16px;
      font-weight: normal;
      padding-bottom: 20px;
    }
    .pic {
      display: flex;
      width: 100%;
      box-sizing: border-box;
      img {
        flex: 1;
        padding: 0 5px;
        object-fit: cover;
      }
    }
    .info {
      display: flex;
      padding: 15px 0;
      color: #999;
      .comm {
        margin: 0 10px;
      }
      .time {
        flex: 1;
      }
    }
  }
}
</style>
