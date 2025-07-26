<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="hasPerm(['admin/content.Setting/basicInfo'])" :label="$t('基本设置')" lazy>
        <Basic />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/content.Setting/apiInfo'])" :label="$t('前台设置')" lazy>
        <Api />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { hasPerm } from '@/utils/index'
import Api from './component/Api.vue'
import Basic from './component/Basic.vue'

export default {
  name: 'ContentSetting',
  components: { Api, Basic },
  data() {
    return {
      name: '内容设置'
    }
  },
  methods: {
    hasPerm
  }
}
</script>
