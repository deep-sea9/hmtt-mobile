<template>
  <div class="container">
    <van-nav-bar
      fixed
      left-arrow
      @click-left="closeChat"
      title="小智同学"
    ></van-nav-bar>
    <div class="chat-list" ref="chatlist">
      <div v-for="(item, index) in list" :key="index">
        <!-- 左侧是机器人小智 -->
        <div class="chat-item left" v-if="!item.isMe">
          <van-image
            fit="cover"
            round
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div class="chat-pao">{{ item.msg }}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-else>
          <div class="chat-pao my">{{ item.msg }}</div>
          <van-image fit="cover" round :src="$store.state.userInfo.photo" />
        </div>
      </div>
    </div>
    <div class="reply-container van-hairline--top">
      <van-field
        placeholder="说点什么..."
        v-model.trim="msg"
        @keyup.enter="send"
      >
        <template #button>
          <span style="font-size:12px;color:#999" @click="send">
            提交
          </span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'

export default {
  name: 'UserChat',
  data () {
    return {
      list: [],
      socket: null,
      msg: ''
    }
  },
  created () {
    this.socket = io('http://toutiao.itheima.net', {
      query: {
        token: this.$store.state.token.token
      },
      transports: ['websocket']
    })

    this.socket.on('connect', () => {
      this.list.push({
        isMe: false,
        msg: '你好,我们小智同学!'
      })
    })

    this.socket.on('message', data => {
      this.list.push({
        isMe: false,
        msg: data.msg
      })
      this.setScroll()
    })
  },
  methods: {
    send () {
      if (this.msg === '') return
      this.socket.emit('message', {
        msg: this.msg
      })
      this.list.push({
        isMe: true,
        msg: this.msg
      })
      this.msg = ''
      this.setScroll()
    },
    setScroll () {
      this.$nextTick(() => {
        this.$refs.chatlist.scrollTop = this.$refs.chatlist.scrollHeight
      })
    },
    closeChat () {
      this.$router.back()
      this.socket.close()
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
      .chat-pao.my {
        background-color: #9eea6a;
        &::before {
          content: '';
          background: #9eea6a;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
