<template>
  <el-tabs v-model="actTabName" @tab-click="tabClick">
    <el-tab-pane v-if="checkPermission(['admin/admin.Utils/mapAmap'])" label="高德地图" name="MapAmap">
      <map-amap v-if="MapAmap" />
    </el-tab-pane>
    <el-tab-pane v-if="checkPermission(['admin/admin.Utils/mapBaidu'])" label="百度地图" name="MapBaidu">
      <map-baidu v-if="MapBaidu" />
    </el-tab-pane>
    <el-tab-pane v-if="checkPermission(['admin/admin.Utils/mapSogou'])" label="搜狗地图" name="MapSogou">
      <map-sogou v-if="MapSogou" />
    </el-tab-pane>
    <el-tab-pane v-if="checkPermission(['admin/admin.Utils/mapTencent'])" label="腾讯地图" name="MapTencent">
      <map-tencent v-if="MapTencent" />
    </el-tab-pane>
    <el-tab-pane v-if="checkPermission(['admin/admin.Utils/mapBeidou'])" label="北斗" name="MapBeidou">
      <map-beidou v-if="MapBeidou" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import MapAmap from './MapAmap'
import MapBaidu from './MapBaidu'
import MapSogou from './MapSogou'
import MapTencent from './MapTencent'
import MapBeidou from './MapBeidou'

export default {
  name: 'Map',
  components: { MapAmap, MapBaidu, MapSogou, MapTencent, MapBeidou },
  data() {
    return {
      MapAmap: false,
      MapBaidu: true,
      MapSogou: false,
      MapTencent: false,
      MapBeidou: false,
      actTabName: 'MapBaidu'
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
