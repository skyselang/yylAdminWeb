<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="hasPerm(['admin/system.UserCenter/info'])" :label="$t('我的信息')" lazy>
        <Info />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/system.UserCenter/edit'])" :label="$t('修改信息')" lazy>
        <Edit />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/system.UserCenter/pwd'])" :label="$t('修改密码')" lazy>
        <Pwd />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/system.UserCenter/logList'])" :label="$t('我的日志')" lazy>
        <Log />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/system.UserCenter/setting'])" :label="$t('我的设置')" lazy>
        <Setting />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { hasPerm } from '@/utils/index'
import Info from './component/Info.vue'
import Edit from './component/Edit.vue'
import Pwd from './component/Pwd.vue'
import Log from './component/Log.vue'
import Setting from '@/views/system/system/setting.vue'

export default {
  name: 'SystemUserCenter',
  components: { Info, Edit, Pwd, Log, Setting },
  data() {
    return {
      name: '个人中心'
    }
  },
  methods: {
    hasPerm
  }
}
</script>
