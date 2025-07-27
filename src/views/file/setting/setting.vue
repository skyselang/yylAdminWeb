<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="hasPerm(['admin/file.Setting/basicInfo'])" :label="$t('基本设置')" lazy>
        <Basic />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/file.Setting/limitInfo'])" :label="$t('限制设置')" lazy>
        <Limit />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/file.Setting/apiInfo'])" :label="$t('前台设置')" lazy>
        <Api />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { hasPerm } from '@/utils/index'
import Basic from './component/Basic.vue'
import Limit from './component/Limit.vue'
import Api from './component/Api.vue'

export default {
  name: 'FileSetting',
  components: { Basic, Limit, Api },
  data() {
    return {
      name: '文件设置'
    }
  },
  methods: {
    hasPerm
  }
}
</script>
