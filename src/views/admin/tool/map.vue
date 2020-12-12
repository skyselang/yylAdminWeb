<template>
  <div class="app-container">
    <el-tabs v-model="mapTabName">
      <el-tab-pane v-if="checkPermission(['admin/AdminTool/toolMapAmap'])" label="高德地图坐标拾取" name="MapAmap">
        <map-amap />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminTool/toolMapBaidu'])" label="百度地图坐标拾取" name="MapBaidu">
        <map-baidu />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminTool/toolMapSogou'])" label="搜狗地图坐标拾取" name="MapSogou">
        <map-sogou />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminTool/toolMapTencent'])" label="腾讯地图坐标拾取" name="MapTencent">
        <map-tencent />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminTool/toolMapBeidou'])" label="北斗卫星导航系统" name="MapBeidou">
        <map-beidou />
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
  name: 'ToolMap',
  components: { MapAmap, MapBaidu, MapSogou, MapTencent, MapBeidou },
  data() {
    return {
      mapTabName: 'MapBaidu'
    }
  },
  created() { },
  methods: { checkPermission }
}
</script>
