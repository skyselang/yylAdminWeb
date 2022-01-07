<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-result icon="error" title="404" sub-title="页面不存在" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" :offset="6" class="ya-center ya-top">
        <el-button icon="el-icon-arrow-left" @click="back">返回</el-button>
      </el-col>
      <el-col :span="6" class="ya-center ya-top">
        <el-button icon="el-icon-s-home" @click="dashboard">控制台</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" :offset="6" class="ya-center ya-top">
        <a href="https://gitee.com/skyselang/yylAdmin" target="_blank" title="">
          <img src="https://gitee.com/skyselang/yylAdmin/widgets/widget_card.svg?colors=4183c4,ffffff,ffffff,e3e9ed,666666,9b9b9b" alt="" srcset="">
        </a>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AdminBase404',
  data() {
    return {}
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-1)
      }
    },
    dashboard() {
      this.$router.push({ path: '/dashboard' })
    }
  }
}
</script>

<style lang="scss" scoped>
.ya-top {
  margin-top: 2vh;
}
.ya-center {
  text-align: center;
}
</style>
