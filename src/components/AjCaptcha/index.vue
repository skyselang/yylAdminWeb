<template>
  <div v-show="showBox" :class="mode == 'pop' ? 'mask' : ''">
    <div :class="mode == 'pop' ? 'verifybox' : ''" :style="{ 'max-width': parseInt(imgSize.width) + 30 + 'px' }">
      <div v-if="mode == 'pop'" class="verifybox-top">
        <span>{{ $t('AjCaptch.Please complete security verification') }}</span>
        <span class="verifybox-close">
          <el-button :title="$t('AjCaptch.Refresh')" circle @click="refresh">
            <svg-icon icon-class="refresh" />
          </el-button>
          <el-button :title="$t('AjCaptch.Close')" circle @click="closeBox">
            <svg-icon icon-class="close" />
          </el-button>
        </span>
      </div>
      <div class="verifybox-bottom" :style="{ padding: mode == 'pop' ? '0 10px 15px 15px' : '0' }">
        <!-- 验证码容器 -->
        <component
          :is="componentType"
          v-if="componentType"
          ref="instance"
          :captcha-type="captchaType"
          :type="verifyType"
          :figure="figure"
          :arith="arith"
          :mode="mode"
          :v-space="vSpace"
          :explain="$t(explain)"
          :img-size="imgSize"
          :block-size="blockSize"
          :bar-size="barSize"
          :default-img="defaultImg"
        />
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
// 行为验证码组件
import VerifySlide from './Verify/VerifySlide.vue'
import VerifyPoints from './Verify/VerifyPoints.vue'
import defaultImg from '@/assets/images/ajcaptcha.jpg'

export default {
  name: 'AjCaptcha',
  components: {
    VerifySlide,
    VerifyPoints
  },
  props: {
    captchaType: {
      type: String,
      default: '',
      required: true
    },
    figure: {
      type: Number,
      default: 0
    },
    arith: {
      type: Number,
      default: 0
    },
    mode: {
      type: String,
      default: 'pop'
    },
    vSpace: {
      type: Number,
      default: 0
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
      default() {}
    },
    barSize: {
      type: Object,
      default() {}
    }
  },
  data() {
    return {
      // showBox:true,
      clickShow: false,
      // 内部类型
      verifyType: undefined,
      // 所用组件类型
      componentType: undefined,
      // 默认图片
      defaultImg: defaultImg
    }
  },
  computed: {
    instance() {
      return this.$refs.instance || {}
    },
    showBox() {
      if (this.mode === 'pop') {
        return this.clickShow
      } else {
        return true
      }
    }
  },
  watch: {
    captchaType: {
      immediate: true,
      handler(captchaType) {
        switch (captchaType.toString()) {
          case 'blockPuzzle':
            this.verifyType = '2'
            this.componentType = 'VerifySlide'
            break
          case 'clickWord':
            this.verifyType = ''
            this.componentType = 'VerifyPoints'
            break
        }
      }
    }
  },
  mounted() {},
  methods: {
    // 刷新
    refresh() {
      if (this.instance.refresh) {
        this.instance.refresh()
      }
    },
    closeBox() {
      this.clickShow = false
    },
    show() {
      if (this.mode === 'pop') {
        this.clickShow = true
      }
    }
  }
}
</script>
<style>
.verifybox {
  position: relative;
  left: 50%;
  top: 386px;
  box-sizing: border-box;
  border: 1px solid #e4e7eb;
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
}
.verifybox-top {
  padding: 0 15px;
  height: 50px;
  line-height: 50px;
  text-align: left;
  font-size: 16px;
  color: #45494c;
  box-sizing: border-box;
}
.verifybox-bottom {
  padding: 0 10px 15px 15px;
  box-sizing: border-box;
}
.verifybox-close {
  position: absolute;
  right: 9px;
  text-align: center;
  cursor: pointer;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  transition: all 0.5s;
}
.verify-tips {
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 30px;
  line-height: 30px;
  color: #fff;
}
.suc-bg {
  background-color: rgba(92, 184, 92, 0.5);
  filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f5CB85C, endcolorstr=#7f5CB85C);
}
.err-bg {
  background-color: rgba(217, 83, 79, 0.5);
  filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7fD9534F, endcolorstr=#7fD9534F);
}
.tips-enter,
.tips-leave-to {
  bottom: -30px;
}
.tips-enter-active,
.tips-leave-active {
  transition: bottom 0.5s;
}

/*常规验证码*/
.verify-code {
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 5px;
  border: 1px solid #ddd;
}

.cerify-code-panel {
  height: 100%;
  overflow: hidden;
}

.verify-code-area {
  float: left;
}

.verify-input-area {
  float: left;
  width: 60%;
  padding-right: 10px;
}

.verify-change-area {
  line-height: 30px;
  float: left;
}

.varify-input-code {
  display: inline-block;
  width: 100%;
  height: 25px;
}

.verify-change-code {
  color: #337ab7;
  cursor: pointer;
}

.verify-btn {
  width: 200px;
  height: 30px;
  background-color: #337ab7;
  color: #ffffff;
  border: none;
  margin-top: 10px;
}

/*滑动验证码*/
.verify-bar-area {
  position: relative;
  background: #ffffff;
  text-align: center;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  -webkit-border-radius: 4px;
}

.verify-bar-area .verify-move-block {
  position: absolute;
  top: 0px;
  left: 0;
  background: #fff;
  cursor: pointer;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  box-shadow: 0 0 2px #888888;
  border-radius: 1px;
  -webkit-border-radius: 1px;
}

.verify-bar-area .verify-move-block:hover {
  background-color: #337ab7;
  color: #ffffff;
}

.verify-bar-area .verify-left-bar {
  position: absolute;
  top: -1px;
  left: -1px;
  background: #f0fff0;
  cursor: pointer;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  border: 1px solid #ddd;
}

.verify-img-panel {
  margin: 0;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-radius: 3px;
  position: relative;
}

.verify-img-panel .verify-refresh {
  width: 25px;
  height: 25px;
  text-align: center;
  padding: 5px;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
}

.verify-img-panel .verify-gap {
  background-color: #fff;
  position: relative;
  z-index: 2;
  border: 1px solid #fff;
}

.verify-bar-area .verify-move-block .verify-sub-block {
  position: absolute;
  text-align: center;
  z-index: 3;
}

.verify-bar-area .verify-move-block .verify-icon {
  font-size: 18px;
}

.verify-bar-area .verify-msg {
  z-index: 3;
  color: rgb(0, 0, 0);
}

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-check:before {
  content: ' ';
  display: block;
  width: 16px;
  height: 16px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  background-image: url('data:image/png;base64,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');
  background-size: contain;
}

.icon-right:before {
  content: ' ';
  display: block;
  width: 16px;
  height: 16px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-size: cover;
  background-image: url('data:image/png;base64,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');
  background-size: contain;
}
</style>
