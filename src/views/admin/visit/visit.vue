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
          <VisitEchartCount />
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-col :span="24">
          <VisitEchartDate />
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-col :span="24">
          <VisitEchartCity />
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-col :span="24">
          <VisitEchartIsp />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import VisitEchartCount from './components/VisitEchartCount'
import VisitEchartDate from './components/VisitEchartDate'
import VisitEchartCity from './components/VisitEchartCity'
import VisitEchartIsp from './components/VisitEchartIsp'
import GithubGitee from './components/GithubGitee'

export default {
  name: 'Visit',
  components: {
    GithubGitee,
    VisitEchartCount,
    VisitEchartDate,
    VisitEchartCity,
    VisitEchartIsp
  },
  data() {
    return {}
  },
  computed: {},
  created() {}
}
</script>
