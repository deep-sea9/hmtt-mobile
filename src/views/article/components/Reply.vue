<template>
  <van-action-sheet v-model="show" title="发表回复" @closed="$emit('refresh')">
    <div class="content">
      <div class="item">
        <img class="avatar" :src="comment.aut_photo" alt="" />
        <div class="info">
          <h3 class="name">{{ comment.aut_name }}</h3>
          <p class="content">{{ comment.content }}</p>
          <p class="time">
            {{ comment.pubdate | dateFormat }}
          </p>
        </div>
      </div>
      <van-divider>回复列表</van-divider>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="到底了"
        @load="getReplies"
      >
        <div class="item" v-for="item in list" :key="item.com_id">
          <img class="avatar" :src="item.aut_photo" alt="" />
          <div class="info">
            <h3 class="name">{{ item.aut_name }}</h3>
            <p class="content">{{ item.content }}</p>
            <p class="time">
              {{ item.pubdate | dateFormat }}
            </p>
          </div>
        </div>
      </van-list>

      <van-field placeholder="请输入评论内容" v-model.trim="msg">
        <template #button>
          <van-button size="small" type="info" @click="submitReply"
            >回复</van-button
          >
        </template>
      </van-field>
    </div>
  </van-action-sheet>
</template>

<script>
import { comments, setComment } from '@/api/comment'
export default {
  name: '',
  data () {
    return {
      show: false,
      loading: false,
      finished: false,
      // 本条评论内容
      comment: '',
      list: [],
      offset: null,
      msg: ''
    }
  },
  methods: {
    // 获取评论
    async getReplies () {
      const res = await comments({
        type: 'c',
        source: this.comment.com_id,
        offset: this.offset,
        limit: 10
      })
      this.loading = false
      this.list.push(...res.data.data.results)
      this.offset = res.data.data.last_id
      if (res.data.data.endId === res.data.data.lastId) {
        this.finished = true
      }
    },
    // 回复评论
    async submitReply () {
      if (!this.msg) return
      const res = await setComment({
        target: this.comment.com_id,
        content: this.msg,
        art_id: this.comment.art_id
      })
      console.log(res)
      this.list.unshift(res.data.data.new_obj)
      this.comment.reply_count++
      this.$toast.success('回复成功')
      this.msg = ''
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 15px;
  .item {
    display: flex;
    margin-bottom: 20px;

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 15px;
    }
    .info {
      flex: 1;
      .name {
        font-size: 16px;
        color: #7882b2;
        font-weight: 400;
      }
      .content {
        padding: 10px 0;
      }
      .time {
        span {
          border: 1px solid #f1f1f1;
          padding: 3px;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>
