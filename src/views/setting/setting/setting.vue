<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="hasPerm(['admin/setting.Setting/basicInfo'])" :label="$t('基本设置')" lazy>
        <Basic />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/setting.Setting/contactInfo'])" :label="$t('联系设置')" lazy>
        <Contact />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { hasPerm } from '@/utils/index'
import Basic from './component/Basic.vue'
import Contact from './component/Contact.vue'

export default {
  name: 'SettingSetting',
  components: { Basic, Contact },
  data() {
    return {
      name: '设置管理'
    }
  },
  methods: {
    hasPerm
  }
}
</script>
