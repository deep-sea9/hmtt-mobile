const path = require('path')
module.exports = ({ file }) => {
  // const base= file.includes(path.join('node_modules','vant'))?375:750
  return {
    plugins: {
      'postcss-px-to-viewport': {
        viewportWidth: 375
      }
    }
  }
}
