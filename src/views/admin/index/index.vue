<template>
  <div class="app-container">
    <el-row :gutter="0">
      <el-col :span="24">
        <statistic-user v-if="checkPermission(['admin/AdminIndex/statisticUser'])" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import StatisticUser from './components/StatisticUser'

export default {
  name: 'Index',
  components: { StatisticUser },
  data() {
    return {
      MapAmap: false,
      StatisticUser: true,
      MapSogou: false,
      MapTencent: false,
      MapBeidou: false,
      actTabName: 'StatisticUser'
    }
  },
  created() { },
  methods: {
    checkPermission,
    tabClick(tab) {
      this[tab.name] = true
    }
  }
}
</script>
