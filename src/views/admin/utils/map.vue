<template>
  <div class="app-container">
    <el-tabs v-model="actTabName" @tab-click="tabClick">
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/mapAmap'])" label="高德地图坐标拾取" name="MapAmap">
        <map-amap v-if="MapAmap" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/mapBaidu'])" label="百度地图坐标拾取" name="MapBaidu">
        <map-baidu v-if="MapBaidu" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/mapSogou'])" label="搜狗地图坐标拾取" name="MapSogou">
        <map-sogou v-if="MapSogou" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/mapTencent'])" label="腾讯地图坐标拾取" name="MapTencent">
        <map-tencent v-if="MapTencent" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/mapBeidou'])" label="北斗卫星导航系统" name="MapBeidou">
        <map-beidou v-if="MapBeidou" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import MapAmap from './components/MapAmap'
import MapBaidu from './components/MapBaidu'
import MapSogou from './components/MapSogou'
import MapTencent from './components/MapTencent'
import MapBeidou from './components/MapBeidou'

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
