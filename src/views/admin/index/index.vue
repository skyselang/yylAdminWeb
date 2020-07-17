<template>
  <div class="app-container">
    <div class="filter-container">
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

export default {
  name: 'Dashboard',
  components: { VisitEchart },
  data() {
    return {}
  },
  computed: {},
  created() {}
}
</script>
