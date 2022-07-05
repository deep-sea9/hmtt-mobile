/**
 * 过滤器全局封装
 */
import moment from 'moment'
moment.locale('zh-cn')

const filters = {
  dateFormat: value => {
    return moment(value).fromNow()
  }
}

export default {
  install (Vue) {
    Object.keys(filters).forEach(item => {
      Vue.filter(item, filters[item])
    })
  }
}
