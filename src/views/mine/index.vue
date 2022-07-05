<template>
  <div class="mine">
    <!-- 头部 -->
    <div class="top">
      <img class="avatar" :src="userInfo.photo" alt="" />
      <div class="info">
        <h5 class="name">{{ userInfo.name }}</h5>
        <div class="fan">
          <span @click="$router.push('/follow')"
            >关注 {{ user.follow_count }}</span
          >
          <span @click="$router.push('/fans')">粉丝 {{ user.fans_count }}</span>
        </div>
      </div>
    </div>
    <!-- 中间 -->
    <div class="middle">
      <div class="item">
        <van-icon name="newspaper-o" color="#8daaff" />
        <p>我的作品</p>
      </div>
      <div class="item">
        <van-icon
          name="star-o"
          color="#ff3800"
          @click="$router.push('/collect')"
        />
        <p>我的收藏</p>
      </div>
      <div class="item" @click="$router.push('/history')">
        <van-icon name="todo-list-o" color="#ffb542" />
        <p>阅读历史</p>
      </div>
    </div>
    <!-- 列表 -->
    <van-cell-group>
      <van-cell title="编辑资料" icon="edit" is-link to="/mine/edit" />
      <van-cell title="小智同学" icon="chat-o" is-link to="/chat" />
      <van-cell title="系统设置" icon="setting-o" is-link />
      <van-cell title="退出登录" icon="warning-o" is-link @click="logout" />
    </van-cell-group>

    <!-- 修改名称 -->
  </div>
</template>

<script>
import { user } from '@/api/user'
import { mapState } from 'vuex'
export default {
  name: 'Mine',
  data () {
    return {
      user: ''
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  created () {
    this.getUser()
  },
  methods: {
    // 退出登录
    logout () {
      this.$dialog
        .confirm({
          title: '温馨提示',
          message: '亲,您确定要退出登录吗?'
        })
        .then(() => {
          this.$store.commit('logout')
        })
        .catch(() => {
          // on cancel
        })
    },
    // 获取用户自己的信息
    async getUser () {
      const res = await user()
      this.user = res.data.data
    }
  }
}
</script>

<style lang="less" scoped>
.mine {
  .top {
    display: flex;
    align-items: center;
    height: 140px;
    background-color: #3296fa;
    border-radius: 8px;

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 15px 0 25px;
    }
    .info {
      .name {
        font-size: 20px;
        color: #fff;
        padding: 5px 0;
      }
      .fan {
        margin-top: 10px;
        span {
          color: #fff;
          &:nth-child(1) {
            margin-right: 15px;
          }
        }
      }
    }
  }
  .middle {
    display: flex;
    align-items: center;
    padding: 15px 0;
    .item {
      flex: 1;
      text-align: center;
      .van-icon {
        font-size: 30px;
      }
      p {
        margin-top: 5px;
      }
    }
  }
}
</style>
