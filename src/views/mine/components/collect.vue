<template>
  <div class="collect">
    <van-nav-bar
      title="我的收藏"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>
    <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
      <van-list
        v-if="show"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getList"
      >
        <div
          class="item"
          v-for="item in list"
          :key="item.art_id"
          @click="$router.push('/article?art_id=' + item.art_id)"
        >
          <h3>{{ item.title }}</h3>
          <div class="info">
            <span class="name">{{ item.aut_name }}</span>
            <span class="comm">{{ item.comm_count }}评论</span>
            <span class="time">{{ item.pubdate | dateFormat }}</span>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getCollections } from '@/api/article'
export default {
  name: '',
  data () {
    return {
      refreshLoading: false,
      loading: false,
      finished: false,
      show: true,
      list: [],
      query: {
        page: 1,
        per_page: 10
      }
    }
  },
  methods: {
    async getList () {
      const res = await getCollections(this.query)
      console.log(res)
      this.loading = false
      this.list.push(...res.data.data.results)
      this.query.page++
      if (this.list.length === res.data.data.total_count) {
        this.finished = true
      }
    },
    onRefresh () {
      this.refreshLoading = false
      this.loading = false
      this.finished = false
      this.query.page = 1
      this.list = []
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.collect {
  // padding-top: 46px;
  .item {
    padding: 15px;
    border-bottom: 1px solid #ccc;
    h3 {
      font-size: 16px;
      font-weight: normal;
      padding-bottom: 10px;
    }
    .info {
      display: flex;
      color: #999;
      span {
        font-size: 13px;
      }
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
