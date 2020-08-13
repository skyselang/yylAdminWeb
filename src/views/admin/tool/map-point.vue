<template>
  <div class="app-container">
    <el-tabs v-model="tabsActiveName">
      <el-tab-pane name="MapPointAmap" label="高德地图坐标拾取">
        <MapPointAmap />
      </el-tab-pane>
      <el-tab-pane name="MapPointBaidu" label="百度地图坐标拾取">
        <MapPointBaidu />
      </el-tab-pane>
      <el-tab-pane name="MapPointSogou" label="搜狗地图坐标拾取">
        <MapPointSogou />
      </el-tab-pane>
      <el-tab-pane name="MapPointTencent" label="腾讯地图坐标拾取">
        <MapPointTencent />
      </el-tab-pane>
      <el-tab-pane name="MapPointBeidou" label="北斗卫星导航系统">
        <MapPointBeidou />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MapPointAmap from './components/MapPointAmap'
import MapPointBaidu from './components/MapPointBaidu'
import MapPointSogou from './components/MapPointSogou'
import MapPointTencent from './components/MapPointTencent'
import MapPointBeidou from './components/MapPointBeidou'

export default {
  name: 'MapPoint',
  components: {
    MapPointAmap,
    MapPointBaidu,
    MapPointSogou,
    MapPointTencent,
    MapPointBeidou
  },
  data() {
    return {
      tabsActiveName: 'MapPointBaidu'
    }
  },
  created() {},
  methods: {}
}
</script>
