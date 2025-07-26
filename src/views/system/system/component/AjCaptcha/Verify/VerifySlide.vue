<template>
  <div v-loading="loading" style="position: relative">
    <div v-if="type === '2'" class="verify-img-out" :style="{ height: parseInt(setSize.imgHeight) + vSpace + 'px' }">
      <div class="verify-img-panel" :style="{ width: setSize.imgWidth, height: setSize.imgHeight }">
        <img
          :src="backImgBase ? 'data:image/png;base64,' + backImgBase : defaultImg"
          style="width: 100%; height: 100%; display: block"
          alt=""
        />
        <transition name="tips">
          <span v-if="tipWords" class="verify-tips" :class="passFlag ? 'suc-bg' : 'err-bg'">
            {{ tipWords }}
          </span>
        </transition>
      </div>
    </div>
    <!-- 公共部分 -->
    <div
      class="verify-bar-area"
      :style="{ width: setSize.imgWidth, height: barSize.height, 'line-height': barSize.height }"
    >
      <span class="verify-msg" v-text="text"></span>
      <div
        class="verify-left-bar"
        :style="{
          width: leftBarWidth !== undefined ? leftBarWidth : barSize.height,
          height: barSize.height,
          transaction: transitionWidth,
          'border-color': leftBarBorderColor
        }"
      >
        <span class="verify-msg" v-text="finishText"></span>
        <div
          class="verify-move-block"
          :style="{
            width: barSize.height,
            height: barSize.height,
            left: moveBlockLeft,
            transition: transitionLeft,
            'background-color': moveBlockBackgroundColor
          }"
          @touchstart="start"
          @mousedown="start"
        >
          <i :class="['verify-icon iconfont', iconClass]" :style="{ color: iconColor }"></i>
          <div
            v-if="type === '2'"
            class="verify-sub-block"
            :style="{
              height: setSize.imgHeight,
              top: '-' + (parseInt(setSize.imgHeight) + vSpace) + 'px',
              width: Math.floor((parseInt(setSize.imgWidth) * 47) / 310) + 'px',
              'background-size': setSize.imgWidth + ' ' + setSize.imgHeight
            }"
          >
            <img
              :src="'data:image/png;base64,' + blockBackImgBase"
              style="width: 100%; height: 100%; display: block"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
// 滑动
import { aesEncrypt } from '../utils/ase'
import { resetSize } from '../utils/util'
import { reqGet, reqCheck } from '../api/index'

export default {
  name: 'VerifySlide',
  props: {
    captchaType: {
      type: String,
      default: 'blockPuzzle'
    },
    // 弹出式pop，固定fixed
    mode: {
      type: String,
      default: 'pop'
    },
    type: {
      type: String,
      default: '2'
    },
    vSpace: {
      type: Number,
      default: 5
    },
    explain: {
      type: String,
      default() {
        return 'AjCaptch.Swipe right to complete verification' //'向右滑动完成验证'
      }
    },
    imgSize: {
      type: Object,
      default() {
        return {
          width: '360px',
          height: '155px'
        }
      }
    },
    blockSize: {
      type: Object,
      default() {
        return {
          width: '50px',
          height: '50px'
        }
      }
    },
    barSize: {
      type: Object,
      default() {
        return {
          width: '360px',
          height: '40px'
        }
      }
    },
    defaultImg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      secretKey: '', // 后端返回的加密秘钥 字段
      passFlag: '', // 是否通过的标识
      backImgBase: '', // 验证码背景图片
      blockBackImgBase: '', // 验证滑块的背景图片
      backToken: '', // 后端返回的唯一token值
      startMoveTime: '', // 移动开始的时间
      endMovetime: '', // 移动结束的时间
      tipsBackColor: '', // 提示词的背景颜色
      tipWords: '',
      text: '',
      finishText: '',
      setSize: {
        imgHeight: 0,
        imgWidth: 0,
        barHeight: 0,
        barWidth: 0
      },
      top: 0,
      left: 0,
      moveBlockLeft: undefined,
      leftBarWidth: undefined,
      moveBlockBackgroundColor: undefined, // 移动中样式
      leftBarBorderColor: '#ddd',
      iconColor: undefined,
      iconClass: 'icon-right',
      status: false, // 鼠标状态
      isEnd: false, // 是否验证完成
      transitionLeft: '',
      transitionWidth: ''
    }
  },
  computed: {
    barArea() {
      return this.$el.querySelector('.verify-bar-area')
    },
    resetSize() {
      return resetSize
    }
  },
  watch: {
    // type变化则全面刷新
    type: {
      immediate: true,
      handler() {
        this.init()
      }
    }
  },
  mounted() {
    // 禁止拖拽
    this.$el.onselectstart = function () {
      return false
    }
  },
  methods: {
    init() {
      this.text = this.explain
      this.getPictrue()
      this.$nextTick(() => {
        const setSize = this.resetSize(this) // 重新设置宽度高度
        for (const key in setSize) {
          this.setSize[key] = setSize[key]
        }
        this.$parent.$emit('ready', this)
      })

      let _this = this

      window.removeEventListener('touchmove', function (e) {
        _this.move(e)
      })
      window.removeEventListener('mousemove', function (e) {
        _this.move(e)
      })

      // 鼠标松开
      window.removeEventListener('touchend', function () {
        _this.end()
      })
      window.removeEventListener('mouseup', function () {
        _this.end()
      })

      window.addEventListener('touchmove', function (e) {
        _this.move(e)
      })
      window.addEventListener('mousemove', function (e) {
        _this.move(e)
      })

      // 鼠标松开
      window.addEventListener('touchend', function () {
        _this.end()
      })
      window.addEventListener('mouseup', function () {
        _this.end()
      })
    },

    // 鼠标按下
    start: function (e) {
      e = e || window.event
      let x
      if (!e.touches) {
        // 兼容PC端
        x = e.clientX
      } else {
        // 兼容移动端
        x = e.touches[0].pageX
      }
      this.startLeft = Math.floor(x - this.barArea.getBoundingClientRect().left)
      // 开始滑动的时间
      this.startMoveTime = +new Date()
      if (this.isEnd === false) {
        this.text = ''
        this.iconColor = '#fff'
        this.leftBarBorderColor = '#337AB7'
        this.moveBlockBackgroundColor = '#337ab7'
        e.stopPropagation()
        this.status = true
      }
    },
    // 鼠标移动
    move: function (e) {
      e = e || window.event
      if (this.status && this.isEnd === false) {
        let x
        if (!e.touches) {
          // 兼容PC端
          x = e.clientX
        } else {
          // 兼容移动端
          x = e.touches[0].pageX
        }
        let bar_area_left = this.barArea.getBoundingClientRect().left
        // 小方块相对于父元素的left值
        let move_block_left = x - bar_area_left
        if (move_block_left >= this.barArea.offsetWidth - parseInt(parseInt(this.blockSize.width) / 2) - 2) {
          move_block_left = this.barArea.offsetWidth - parseInt(parseInt(this.blockSize.width) / 2) - 2
        }
        if (move_block_left <= 0) {
          move_block_left = parseInt(parseInt(this.blockSize.width) / 2)
        }
        // 拖动后小方块的left值
        this.moveBlockLeft = move_block_left - this.startLeft + 'px'
        this.leftBarWidth = move_block_left - this.startLeft + 'px'
      }
    },

    // 鼠标松开
    end: function () {
      this.endMovetime = +new Date()
      let _this = this
      // 判断是否重合
      if (this.status && this.isEnd === false) {
        let moveLeftDistance = parseInt((this.moveBlockLeft || '').replace('px', ''))
        moveLeftDistance = (moveLeftDistance * 310) / parseInt(this.setSize.imgWidth)
        const data = {
          captchaType: this.captchaType,
          pointJson: this.secretKey
            ? aesEncrypt(JSON.stringify({ x: moveLeftDistance, y: 5.0 }), this.secretKey)
            : JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
          token: this.backToken
        }
        reqCheck(data)
          .then((ret) => {
            const res = ret.data
            if (res.repCode === '0000') {
              this.moveBlockBackgroundColor = '#5cb85c'
              this.leftBarBorderColor = '#5cb85c'
              this.iconColor = '#fff'
              this.iconClass = 'icon-check'
              this.isEnd = true
              if (this.mode === 'pop') {
                setTimeout(() => {
                  this.$parent.clickShow = false
                }, 1500)
              }
              this.passFlag = true
              this.tipWords = `${((this.endMovetime - this.startMoveTime) / 1000).toFixed(2)}s` + this.$t('验证成功')
              let captchaVerification = this.secretKey
                ? aesEncrypt(this.backToken + '---' + JSON.stringify({ x: moveLeftDistance, y: 5.0 }), this.secretKey)
                : this.backToken + '---' + JSON.stringify({ x: moveLeftDistance, y: 5.0 })
              setTimeout(() => {
                this.tipWords = ''
                this.$parent.closeBox()
                this.$parent.$emit('success', { captchaVerification })
              }, 700)
            } else {
              this.moveBlockBackgroundColor = '#d9534f'
              this.leftBarBorderColor = '#d9534f'
              this.iconClass = 'icon-close'
              this.iconColor = '#fff'
              this.passFlag = false
              setTimeout(function () {
                _this.refresh()
              }, 1000)
              this.$parent.$emit('error', this)
              this.tipWords = this.$t('验证失败')
              setTimeout(() => {
                this.tipWords = ''
              }, 1000)
            }
          })
          .catch(() => {})
        this.status = false
      }
    },

    refresh: function () {
      this.transitionWidth = 'width .3s'
      this.transitionLeft = 'left .3s'
      this.leftBarWidth = undefined
      this.leftBarBorderColor = '#ddd'
      this.moveBlockBackgroundColor = '#fff'
      this.moveBlockLeft = 0
      this.finishText = ''
      this.iconColor = '#000'
      this.iconClass = 'icon-right'
      this.isEnd = false

      this.getPictrue()
      setTimeout(() => {
        this.transitionLeft = ''
        this.transitionWidth = ''
        this.text = this.explain
      }, 300)
    },

    // 请求背景图片和验证图片
    getPictrue() {
      this.loading = true
      const data = {}
      reqGet(data)
        .then((ret) => {
          const res = ret.data
          if (res.repCode === '0000') {
            this.backToken = res.repData.token
            this.secretKey = res.repData.secretKey
            this.backImgBase = res.repData.originalImageBase64
            this.blockBackImgBase = res.repData.jigsawImageBase64
          } else {
            this.tipWords = res.repMsg
          }

          // 判断接口请求次数是否失效
          if (res.repCode === '6201') {
            this.backImgBase = null
            this.blockBackImgBase = null
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
