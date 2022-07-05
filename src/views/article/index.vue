<template>
  <div class="article" ref="article">
    <van-nav-bar
      title="文章详情"
      left-arrow
      fixed
      @click-left="$router.back()"
    ></van-nav-bar>
    <div class="content" ref="content">
      <h1 class="title">{{ article.title }}</h1>
      <div class="info">
        <img class="avatar" :src="article.aut_photo" alt="" />
        <div class="msg">
          <h3 class="name">{{ article.aut_name }}</h3>
          <p class="time">
            {{ article.pubdate | dateFormat }}
            <span>阅读 {{ article.read_count }}</span>
          </p>
        </div>
        <van-button
          :icon="article.is_followed ? 'success' : 'plus'"
          round
          type="info"
          @click="following"
          >关注</van-button
        >
      </div>
      <div class="text" v-html="article.content"></div>
      <van-divider>end</van-divider>
    </div>
    <Comment ref="comment"></Comment>
    <div class="footer">
      <van-button
        icon="edit"
        class="edit_comm"
        size="small"
        @click="$refs.comment.show = true"
        >写评论</van-button
      >
      <div class="item" @click="scrollCommet">
        <van-icon name="comment-o" />
        <span>{{ article.comm_count }}</span>
      </div>
      <div class="item" @click="setCollecting">
        <van-icon
          :name="article.is_collected ? 'star' : 'star-o'"
          :class="{ active: article.is_collected }"
        />
        <span>收藏</span>
      </div>
      <div class="item" @click="liking">
        <van-icon
          :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
          :class="{ active: article.attitude === 1 }"
        />
        <span>{{ article.like_count }}</span>
      </div>
      <div class="item" @click="disliking">
        <van-icon
          :name="article.attitude === 0 ? 'good-job' : 'good-job-o'"
          class="dislike"
          :class="{ active: article.attitude === 0 }"
        />
        <span>踩</span>
      </div>
      <div class="item">
        <van-icon name="share-o" />
        <span>分享</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle, collections, likings, dislikes } from '@/api/article'
import { following } from '@/api/user'
import Comment from './components/Comment.vue'
export default {
  name: 'Article',
  components: { Comment },
  data () {
    return {
      article: ''
    }
  },
  created () {
    this.getContent()
  },
  methods: {
    // 获取文章详情
    async getContent () {
      const res = await getArticle(this.$route.query.art_id)
      // console.log('文章', res)
      this.article = res.data.data
    },
    // 关注用户与取消关注
    async following () {
      await following(
        {
          target: this.article.aut_id
        },
        this.article.is_followed
      )
      this.$toast.success(
        this.article.is_followed ? '取消关注' : '关注用户成功'
      )
      this.article.is_followed = !this.article.is_followed
    },
    // 收藏文章与取消收藏
    async setCollecting () {
      await collections(
        {
          target: this.article.art_id
        },
        this.article.is_collected
      )
      this.$toast(this.article.is_collected ? '取消收藏' : '收藏成功')
      this.article.is_collected = !this.article.is_collected
    },
    // 对文章点赞和取消点赞
    async liking () {
      await likings(
        {
          target: this.article.art_id
        },
        this.article.attitude
      )
      this.$toast.success(this.article.attitude === 1 ? '取消点赞' : '点赞成功')
      this.article.attitude = this.article.attitude === 1 ? -1 : 1
    },
    // 对文章不喜欢和取消不喜欢
    async disliking () {
      await dislikes(
        {
          target: this.article.art_id
        },
        this.article.attitude
      )
      this.article.attitude = this.article.attitude === 0 ? -1 : 0
    },
    scrollCommet () {
      this.$nextTick(() => {
        this.$refs.article.scrollTop = this.$refs.content.scrollHeight
      })
    },
    scrollEvent (e) {
      // console.log(e.target.scrollTop)
    }
  }
}
</script>

<style lang="less" scoped>
.article {
  height: 100vh;
  padding-top: 46px;
  padding-bottom: 75px;
  overflow-y: auto;
  .content {
    padding: 10px 15px;

    .info {
      display: flex;
      align-items: center;

      .avatar {
        width: 100%;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 20px;
      }
      .msg {
        flex: 1;
        .name {
          font-size: 18px;
          font-weight: normal;
        }
        .time {
          font-size: 16px;
          color: #999;
          margin-top: 5px;
        }
      }
    }
    .text {
      padding: 15px 0;
      word-break: break-all;
      line-break: anywhere;
      line-height: 1.5;
      ::v-deep img {
        width: 100%;
      }
      ::v-deep pre {
        word-break: break-all;
        line-break: anywhere;
        background-color: #f1f1f1;
        color: #000;
        overflow-x: auto;
      }
    }
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 15px 0;
    width: 100vw;
    background-color: #fff;
    .edit_comm {
      flex: 1;
      margin: 0 10px;
      border: none;
      background-color: #f4f4f4;
      border-radius: 10px;
    }
    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      padding: 0 15px;

      .van-icon {
        font-size: 20px;
      }
      span {
        font-size: 12px;
        margin-top: 5px;
      }

      .dislike {
        transform: rotateX(-180deg);
      }
    }
  }
}
.active {
  color: red;
}
</style>
