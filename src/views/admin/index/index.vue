<template>
  <div class="filter-container">
    <el-row :gutter="0">
      <el-col :span="24">
        <Visit />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Visit from '../visit/visit' // 访问统计

export default {
  name: 'Dashboard',
  components: { Visit },
  data() {
    return {}
  },
  computed: {},
  created() {}
}
</script>
