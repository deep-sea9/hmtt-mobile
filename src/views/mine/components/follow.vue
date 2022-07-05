<template>
  <div class="follow">
    <van-nav-bar
      title="我的关注"
      left-arrow
      left-text="返回"
      @click-left="$router.back()"
    ></van-nav-bar>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getFollow"
    >
      <div class="item" v-for="item in list" :key="item.id">
        <img class="avatar" :src="item.photo" alt="" />
        <div class="info">
          <div class="name">{{ item.name }}</div>
          <div class="fan">{{ item.fans_count }} 粉丝</div>
        </div>
        <van-button icon="success">已关注</van-button>
      </div>
    </van-list>
  </div>
</template>

<script>
import { followList } from '@/api/user'
export default {
  name: '',
  data () {
    return {
      loading: false,
      finished: false,
      list: [],
      query: {
        page: 1,
        per_page: 10
      }
    }
  },
  methods: {
    async getFollow () {
      const res = await followList(this.query)
      console.log(res)
      this.loading = false
      this.list.push(...res.data.data.results)
      this.query.page++
      if (this.list.length === res.data.data.total_count) {
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.follow {
  .item {
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #f1f1f1;
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }
    .info {
      flex: 1;
      margin-left: 15px;
      .name {
        margin-bottom: 5px;
      }
    }
  }
}
</style>
