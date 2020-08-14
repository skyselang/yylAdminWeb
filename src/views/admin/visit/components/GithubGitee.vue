<template>
  <el-card>
    <el-row :gutter="0">
      <el-col :xs="24" :sm="3">
        yylAdmin：
      </el-col>
      <el-col :xs="24" :sm="3">
        <el-link href="https://github.com/skyselang/yylAdmin" target="_blank" title="Github" :underline="false" type="primary">
          Github
        </el-link>
      </el-col>
      <el-col :xs="24" :sm="3">
        <a href="https://gitee.com/skyselang/yylAdmin" target="_blank" title="Gitee">
          <img src="https://gitee.com/skyselang/yylAdmin/badge/star.svg?theme=white" alt="star">
        </a>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'GithubGitee',
  components: {},
  data() {
    return {}
  },
  created() {}
}
</script>
