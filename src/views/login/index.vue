<template>
  <div class="login">
    <van-nav-bar title="登录" left-arrow />
    <div class="login-box">
      <h3>短信登录</h3>
      <van-form ref="form">
        <van-field
          v-model.trim="loginForm.mobile"
          label="手机号"
          placeholder="请输入手机号"
          :rules="rules.mobile"
        />
        <van-field
          v-model.trim="loginForm.code"
          label="验证码"
          placeholder="请输入验证码"
          :rules="rules.code"
        >
          <template #button>
            <span
              style="font-size: 13px;margin-right: 10px;color:#999"
              @click="getCode"
              >{{ second === 0 ? '发送验证码' : `${second}秒后重新发送` }}</span
            >
          </template>
        </van-field>
        <div style="margin: 16px;">
          <van-button
            round
            block
            type="info"
            native-type="submit"
            @click="login"
            >登录</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { codes, authorizations } from '@/api/user'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        mobile: '13688888888',
        code: ''
      },
      rules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '请输入6位数字验证码' }
        ]
      },
      second: 0,
      timer: null
    }
  },
  methods: {
    // 获取手机验证码
    async getCode () {
      // await this.$refs.form.validate('mobile')
      // 正在发送短信,此时不能点击发送
      if (this.second > 0) return
      if (!this.loginForm.mobile) return this.$toast.fail('请先输入手机号')
      await codes({
        mobile: this.loginForm.mobile
      })
      this.second = 60
      this.timer = setInterval(() => {
        this.second--
        if (this.second <= 0) {
          this.second = 0
          clearInterval(this.timer)
        }
      }, 1000)
    },
    // 用户登录
    async login () {
      await this.$refs.form.validate()
      try {
        const res = await authorizations(this.loginForm)
        // 将token存储到vuex
        this.$store.commit('setToken', res.data.data)
        this.$toast.loading({
          message: '正在登录...',
          forbidClick: true,
          onClose: () => {
            this.$router.push('/')
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-box {
  padding: 0 15px;
  h3 {
    padding: 50px 0;
    font-size: 23px;
    font-weight: normal;
    color: #333;
    padding-left: 15px;
  }
}
</style>
