<template>
  <el-switch
    inline-prompt
    :active-value="1"
    :inactive-value="0"
    :active-text="activeText"
    :inactive-text="inactiveText"
  />
</template>

<script>
import i18n from '@/lang/index'

export default {
  props: {
    activeText: {
      type: String,
      default: i18n.global.t('开')
    },
    inactiveText: {
      type: String,
      default: i18n.global.t('关')
    }
  }
}
</script>
