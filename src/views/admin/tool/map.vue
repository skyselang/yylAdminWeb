<template>
  <div class="app-container">
    <el-tabs v-model="tabsActiveName">
      <el-tab-pane name="MapAmap" label="高德地图坐标拾取">
        <MapAmap />
      </el-tab-pane>
      <el-tab-pane name="MapBaidu" label="百度地图坐标拾取">
        <MapBaidu />
      </el-tab-pane>
      <el-tab-pane name="MapSogou" label="搜狗地图坐标拾取">
        <MapSogou />
      </el-tab-pane>
      <el-tab-pane name="MapTencent" label="腾讯地图坐标拾取">
        <MapTencent />
      </el-tab-pane>
      <el-tab-pane name="MapBeidou" label="北斗卫星导航系统">
        <MapBeidou />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MapAmap from './components/MapAmap'
import MapBaidu from './components/MapBaidu'
import MapSogou from './components/MapSogou'
import MapTencent from './components/MapTencent'
import MapBeidou from './components/MapBeidou'

export default {
  name: 'Map',
  components: {
    MapAmap,
    MapBaidu,
    MapSogou,
    MapTencent,
    MapBeidou
  },
  data() {
    return {
      tabsActiveName: 'MapBaidu'
    }
  },
  created() {},
  methods: {}
}
</script>
