<template>
  <div class="result">
    <van-nav-bar
      :title="query.q + ' 的搜索结果'"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onload"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        @click="$router.push('/article?art_id=' + item.art_id)"
        >{{ item.title }}</van-cell
      >
    </van-list>
  </div>
</template>

<script>
import { results } from '@/api/search'
export default {
  name: '',
  data () {
    return {
      loading: false,
      finished: false,
      list: [],
      query: {
        page: 1,
        per_page: 10,
        q: decodeURIComponent(this.$route.query.keyword)
      }
    }
  },
  methods: {
    async onload () {
      const res = await results(this.query)
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

<style lang="less" scoped></style>
