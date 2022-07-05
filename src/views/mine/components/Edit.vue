<template>
  <div class="edit">
    <van-nav-bar
      title="编辑"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>

    <van-uploader :after-read="afterRead" :before-read="beforeRead">
      <div class="avatar_box">
        <img :src="userInfo.photo" alt="" />
      </div>
    </van-uploader>
    <van-cell-group>
      <van-cell
        title="名称"
        :value="userInfo.name"
        is-link
        @click="nameShow = true"
      ></van-cell>
      <van-cell
        title="性别"
        :value="userInfo.sex"
        is-link
        @click="genderShow = true"
      ></van-cell>
      <van-cell
        title="生日"
        :value="userInfo.birthday"
        is-link
        @click="birthdayShow = true"
      ></van-cell>
    </van-cell-group>

    <!-- 修改名称 -->
    <van-popup
      v-model="nameShow"
      round
      :style="{ width: '80%' }"
      class="nameModal"
    >
      <h3>修改名称</h3>
      <van-cell-group>
        <van-field v-model.trim="name" />
      </van-cell-group>
      <div class="btn">
        <van-button @click="nameShow = false">取消</van-button>
        <van-button @click="updateName">确定</van-button>
      </div>
    </van-popup>

    <!-- 修改性别 -->
    <van-popup v-model="genderShow" round position="bottom">
      <van-picker
        show-toolbar
        :columns="['男', '女']"
        @cancel="genderShow = false"
        @confirm="updateGender"
        :default-index="gender"
      />
    </van-popup>

    <!-- 修改生日 -->
    <van-popup v-model="birthdayShow" round position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="birthdayShow = false"
        @confirm="updateBirthday"
      />
    </van-popup>

    <!-- 剪裁框 -->
    <div class="crop-box" v-if="cropShow">
      <VueCropper
        ref="cropper"
        :img="img"
        autoCrop
        autoCropWidth="200px"
        autoCropHeight="200px"
      ></VueCropper>
      <div class="btn">
        <van-button type="primary" @click="updateAvatar">剪裁</van-button>
        <van-button type="primary" @click="cropShow = false">取消</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { profile, photo } from '@/api/user'
import moment from 'moment'
import { VueCropper } from 'vue-cropper'
export default {
  name: 'Edit',
  components: { VueCropper },
  data () {
    return {
      nameShow: false,
      genderShow: false,
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.$store.state.userInfo.birthday),
      name: this.$store.state.userInfo.name,
      gender: this.$store.state.userInfo.gender,
      birthdayShow: false,
      cropShow: false,
      img: ''
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    // 修改姓名
    updateName () {
      this.updateUserInfo('name', this.name)
    },
    // 修改性别
    updateGender (value) {
      const gender = value === '男' ? 0 : 1
      this.updateUserInfo('gender', gender)
    },
    // 修改生日
    updateBirthday (value) {
      this.updateUserInfo('birthday', moment(value).format('YYYY-MM-DD'))
    },
    async updateUserInfo (key, value) {
      if (value === this.userInfo[key] || value === '') {
        return this.$toast.fail('请修改后再提交')
      }
      await profile({
        [key]: value
      })
      this.$store.commit('setUserInfo', {
        ...this.userInfo,
        [key]: value
      })
      this.$toast.success('修改成功')
      this[key + 'Show'] = false
    },
    // 上传前处理
    beforeRead (file) {
      // 文件类型
      const imgArr = ['image/png', 'image/jpeg']
      const limitType = imgArr.includes(file.type)
      if (!limitType) {
        this.$toast.fail('请上传png或jpg格式的图片')
      }
      const limitSize = file.size / 1024 / 1024 < 2
      if (!limitSize) {
        this.$toast.fail('请上传2M以内的图片')
      }
      return limitType && limitSize
    },
    // 上传文件后
    afterRead (file) {
      this.cropShow = true
      this.img = file.content
    },
    // 更换头像
    updateAvatar () {
      this.$refs.cropper.getCropBlob(async data => {
        const formData = new FormData()
        formData.append('photo', data)
        const res = await photo(formData)
        this.$toast.success('更换头像成功')
        this.$store.commit('setUserInfo', {
          ...this.userInfo,
          photo: res.data.data.photo
        })
        this.cropShow = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.edit {
  .avatar_box {
    padding: 15px 0;
    display: flex;
    justify-content: center;
    text-align: center;
    width: 100vw;

    img {
      display: block;
      width: 130px;
      height: 130px;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  .nameModal {
    text-align: center;
    h3 {
      padding: 15px 0;
      font-weight: normal;
      font-size: 16px;
    }
    .btn {
      display: flex;
      .van-button {
        flex: 1;
      }
    }
  }
  .crop-box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);

    .btn {
      width: 100%;
      display: flex;
      justify-content: space-between;
      position: fixed;
      left: 0;
      bottom: 0;
    }
  }
}
</style>
