<template>
  <el-tabs value="MapBaidu">
    <el-tab-pane v-if="checkPermission(['admin/admin.Utils/mapAmap'])" label="高德地图" name="MapAmap" lazy>
      <utils-map-amap />
    </el-tab-pane>
    <el-tab-pane v-if="checkPermission(['admin/admin.Utils/mapBaidu'])" label="百度地图" name="MapBaidu" lazy>
      <utils-map-baidu />
    </el-tab-pane>
    <el-tab-pane v-if="checkPermission(['admin/admin.Utils/mapSogou'])" label="搜狗地图" name="MapSogou" lazy>
      <utils-map-sogou />
    </el-tab-pane>
    <el-tab-pane v-if="checkPermission(['admin/admin.Utils/mapTencent'])" label="腾讯地图" name="MapTencent" lazy>
      <utils-map-tencent />
    </el-tab-pane>
    <el-tab-pane v-if="checkPermission(['admin/admin.Utils/mapBeidou'])" label="北斗" name="MapBeidou" lazy>
      <utils-map-beidou />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import UtilsMapAmap from './UtilsMapAmap'
import UtilsMapBaidu from './UtilsMapBaidu'
import UtilsMapSogou from './UtilsMapSogou'
import UtilsMapTencent from './UtilsMapTencent'
import UtilsMapBeidou from './UtilsMapBeidou'

export default {
  name: 'UtilsMap',
  components: { UtilsMapAmap, UtilsMapBaidu, UtilsMapSogou, UtilsMapTencent, UtilsMapBeidou },
  data() {
    return {
      name: '地图'
    }
  },
  created() { },
  methods: {
    checkPermission
  }
}
</script>
