<template>
  <div class="search">
    <van-nav-bar
      title="搜索中心"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>
    <van-search
      v-model.trim="keyword"
      show-action
      shape="round"
      placeholder="请输入搜索关键词"
      @input="inputSearch"
      @search="onSearch"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>

    <van-cell-group v-if="list.length > 0 && keyword">
      <van-cell
        icon="search"
        v-for="(item, index) in list"
        :key="index"
        @click="goArticle(item.value)"
      >
        <template #title>
          <div v-html="item.html"></div>
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell title="历史记录" />
      <van-cell
        :title="item"
        v-for="(item, index) in wordsHistory"
        :key="index"
        @click="goResult(item)"
      />
    </van-cell-group>
  </div>
</template>

<script>
import { suggestion } from '@/api/search'
export default {
  name: '',
  data () {
    return {
      keyword: '',
      timer: null,
      list: [],
      // 搜索历史记录
      wordsHistory: JSON.parse(localStorage.getItem('history')) || []
    }
  },
  methods: {
    async inputEvent () {
      if (this.keyword === '') return
      const res = await suggestion({
        q: this.keyword
      })
      if (res.data.data.options[0] === null) {
        this.list = []
      } else {
        this.list = res.data.data.options.map(item => {
          const reg = new RegExp(this.keyword, 'gi')
          return {
            value: item,
            html: item.replace(
              reg,
              `<span style="color:red;">${this.keyword}</span>`
            )
          }
        })
      }
    },
    // 防抖
    inputSearch () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.inputEvent()
      }, 500)
    },
    onSearch () {
      if (this.keyword === '') return
      if (!this.wordsHistory.includes(this.keyword)) {
        this.wordsHistory.unshift(this.keyword)
        localStorage.setItem('history', JSON.stringify(this.wordsHistory))
      }
      this.goResult(this.keyword)
    },
    goResult (keyword) {
      this.$router.push('/search/result?keyword=' + encodeURIComponent(keyword))
    },
    goArticle (item) {
      if (!this.wordsHistory.includes(item)) {
        this.wordsHistory.unshift(item)
        localStorage.setItem('history', JSON.stringify(this.wordsHistory))
      }

      this.goResult(item)
    }
  }
}
</script>

<style lang="less" scoped></style>
