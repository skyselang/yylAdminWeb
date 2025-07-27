<template>
  <el-date-picker
    type="datetime"
    :placeholder="placeholder"
    value-format="YYYY-MM-DD HH:mm:ss"
    :default-time="new Date(2025, 1, 1, 0, 0, 0)"
  />
</template>

<script>
import i18n from '@/lang/index'

export default {
  props: {
    placeholder: {
      type: String,
      default() {
        return i18n.global.t('请选择时间')
      }
    }
  }
}
</script>
