<template>
  <div class="comment">
    <h2 class="title" ref="comm">评论({{ total }})</h2>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="到底了"
      @load="getComments"
    >
      <div class="item" v-for="item in list" :key="item.comm_id">
        <img class="avatar" :src="item.aut_photo" alt="" />
        <div class="info">
          <h3 class="name">{{ item.aut_name }}</h3>
          <p class="content">{{ item.content }}</p>
          <p class="time">
            {{ item.pubdate | dateFormat }}
            <span @click="goReply(item)">回复({{ item.reply_count }})</span>
          </p>
        </div>
        <van-icon
          :name="item.is_liking ? 'like' : 'like-o'"
          :class="{ active: item.is_liking }"
          @click="setLiking(item)"
        />
      </div>
    </van-list>
    <van-popup
      v-model="show"
      position="top"
      :style="{ height: '30%' }"
      @closed="msg = ''"
    >
      <van-field
        v-model.trim="msg"
        rows="5"
        autosize
        type="textarea"
        placeholder="请发表有价值的评论"
      />
      <div class="btn">
        <van-button size="small" @click="show = false">取消</van-button>
        <van-button type="danger" size="small" @click="submitComment"
          >确认</van-button
        >
      </div>
    </van-popup>

    <Reply ref="reply" @refresh="refresh" v-if="bol" />
  </div>
</template>

<script>
import { comments, setComment, likings } from '@/api/comment'
import Reply from './Reply.vue'
export default {
  name: 'Comment',
  components: { Reply },
  data () {
    return {
      loading: false,
      finished: false,
      list: [],
      offset: null,
      total: 0,
      show: false,
      msg: '',
      bol: true,
      scroll: 0
    }
  },
  mounted () {
    // console.log(this.$refs.comm.offsetTop)
    this.scroll = this.$refs.comm.offsetTop
    // console.log(this.$refs.comm)
  },
  methods: {
    // 获取评论
    async getComments () {
      const res = await comments({
        type: 'a',
        source: this.$route.query.art_id,
        offset: this.offset,
        limit: 10
      })
      this.loading = false
      this.list.push(...res.data.data.results)
      this.total = res.data.data.total_count
      this.offset = res.data.data.last_id
      if (res.data.data.endId === res.data.data.lastId) {
        this.finished = true
      }
    },
    // 对文章发表评论
    async submitComment () {
      if (!this.msg) return
      const res = await setComment({
        target: this.$route.query.art_id,
        content: this.msg
      })
      // console.log('评论', res)
      this.list.unshift(res.data.data.new_obj)
      this.total++
      this.$toast.success('发表评论成功')
      this.show = false
    },
    // 进入回复页面
    goReply (item) {
      this.$refs.reply.show = true
      this.$refs.reply.comment = item
    },
    refresh () {
      this.bol = false
      this.$nextTick(() => {
        this.bol = true
      })
    },
    // 评论点赞
    async setLiking (item) {
      await likings(
        {
          target: item.com_id
        },
        item.is_liking
      )
      this.$toast.success(item.is_liking ? '取消点赞成功' : '点赞成功')
      item.is_liking = !item.is_liking
    }
  }
}
</script>

<style lang="less" scoped>
.comment {
  padding: 0 15px;
  .title {
    padding: 15px 0;
    font-size: 18px;
  }
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
.active {
  color: red;
}
.btn {
  display: flex;
  justify-content: flex-end;
  padding-right: 15px;
  .van-button {
    margin-left: 10px;
    padding: 0 15px;
  }
}
</style>
