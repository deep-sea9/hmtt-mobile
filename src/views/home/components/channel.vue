<template>
  <van-action-sheet v-model="show" title="标题" @closed="isEdit = false">
    <div class="content">
      <div class="top">
        <h3>我的频道</h3>
        <van-button
          plain
          type="danger"
          size="small"
          @click="isEdit = !isEdit"
          >{{ isEdit ? '完成' : '编辑' }}</van-button
        >
      </div>
      <van-grid>
        <van-grid-item
          v-for="(item, index) in list"
          :key="item.id"
          @click="$emit('setIndex', index)"
        >
          <span :class="{ active: currentIndex === index }" class="msg">{{
            item.name
          }}</span>
          <van-icon
            name="cross"
            class="icon"
            v-if="isEdit && item.name !== '推荐'"
            @click="delChannel(index)"
          />
        </van-grid-item>
      </van-grid>
      <div class="bottom">
        <h3>可选频道</h3>
      </div>
      <van-grid>
        <van-grid-item
          :text="item.name"
          v-for="item in optionsChannels"
          :key="item.id"
          @click="addUserChannel(item)"
        />
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
import { allChannels } from '@/api/channel'
export default {
  name: '',
  data () {
    return {
      show: false,
      allChannels: [],
      isEdit: false
    }
  },
  props: {
    list: {
      type: Array
    },
    currentIndex: {
      type: Number
    }
  },
  created () {
    this.getAllChannels()
  },
  methods: {
    async getAllChannels () {
      const res = await allChannels()
      // console.log('所有频道', res)
      this.allChannels = res.data.data.channels
    },
    // 删除指定频道
    async delChannel (index) {
      this.$emit('delChannel', index)
    },
    // 新增用户频道
    async addUserChannel (item) {
      this.$emit('addChannel', item)
    }
  },
  computed: {
    // 筛选可选频道
    optionsChannels () {
      return this.allChannels.filter(
        item => !this.list.find(v => item.id === v.id)
      )
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 15px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
  }
  .bottom {
    padding: 15px 0;
  }
}

.active {
  color: red;
}
.icon {
  position: absolute;
  right: 0;
  top: 0;
  background-color: #ccc;
  border-radius: 50%;
  color: #fff;
}
</style>
