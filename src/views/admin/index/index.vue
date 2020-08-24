<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :span="24">
          <GithubGitee />
        </el-col>
      </el-row>
      <back-to-top transition-name="fade" />
    </div>
  </div>
</template>

<script>
import BackToTop from '@/components/BackToTop'
import GithubGitee from './components/GithubGitee'

export default {
  name: 'Dashboard',
  components: { BackToTop, GithubGitee },
  data() {
    return {}
  },
  computed: {},
  created() {}
}
</script>
