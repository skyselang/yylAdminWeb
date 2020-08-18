<template>
  <div class="filter-container">
    <el-row :gutter="0">
      <el-col :span="24">
        <Visit />
      </el-col>
    </el-row>
    <back-to-top transition-name="fade" />
  </div>
</template>

<script>
import BackToTop from '@/components/BackToTop'
import Visit from '../visit/visit' // 访问统计

export default {
  name: 'Dashboard',
  components: { Visit, BackToTop },
  data() {
    return {}
  },
  computed: {},
  created() {}
}
</script>
