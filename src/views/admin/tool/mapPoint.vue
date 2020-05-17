<template>
  <div class="app-container">
    <el-tabs v-model="tabsActiveName">
      <el-tab-pane name="MapPointAmap" label="高德地图坐标拾取">
        <MapPointAmap />
      </el-tab-pane>
      <el-tab-pane name="MapPointBaidu" label="百度地图坐标拾取">
        <MapPointBaidu />
      </el-tab-pane>
      <el-tab-pane name="MapPointGoogle" label="谷歌地图坐标拾取">
        <MapPointGoogle />
      </el-tab-pane>
      <el-tab-pane name="MapPointQq" label="腾讯地图坐标拾取">
        <MapPointQq />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MapPointAmap from './components/MapPointAmap'
import MapPointBaidu from './components/MapPointBaidu'
import MapPointGoogle from './components/MapPointGoogle'
import MapPointQq from './components/MapPointQq'
export default {
  name: 'MapPoint',
  components: { MapPointAmap, MapPointBaidu, MapPointGoogle, MapPointQq },
  data() {
    return {
      tabsActiveName: 'MapPointBaidu'
    }
  },
  created() {},
  methods: {}
}
</script>
