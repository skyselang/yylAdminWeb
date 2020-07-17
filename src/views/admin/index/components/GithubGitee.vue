<template>
  <div>
    <el-card>
      <el-row :gutter="0">
        <el-col :span="3">
          yylAdmin：
        </el-col>
        <el-col :span="3">
          <el-link :underline="false" type="primary" href="https://github.com/skyselang/yylAdmin" target="_blank" style="font-size:18px;font-weight:500">
            Github
          </el-link>
        </el-col>
        <el-col :span="3">
          <el-link :underline="false" type="primary" href="https://gitee.com/skyselang/yylAdmin" target="_blank" style="font-size:18px;font-weight:500">
            Gitee
          </el-link>
        </el-col>
      </el-row>
    </el-card>
  </div>
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
