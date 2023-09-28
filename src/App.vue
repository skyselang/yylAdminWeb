<template>
  <div id="app">
    <theme-picker v-show="false" @change="themeChange" />
    <router-view />
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'
import { getThemeColor } from '@/utils/settings'

export default {
  name: 'App',
  components: { ThemePicker },
  mounted() {
    if (getThemeColor()) {
      this.themeChange(getThemeColor())
    }
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    }
  }
}
</script>
