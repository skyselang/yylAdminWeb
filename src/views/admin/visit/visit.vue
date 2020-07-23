<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :span="24">
          <GithubGitee />
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-col :span="24">
          <VisitEchart />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import VisitEchart from './components/VisitEchart'
import GithubGitee from './components/GithubGitee'

export default {
  name: 'Visit',
  components: { GithubGitee, VisitEchart },
  data() {
    return {}
  },
  computed: {},
  created() {}
}
</script>
