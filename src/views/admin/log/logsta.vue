<template>
  <div>
    <LogStaNumber />
    <LogStaDate />
    <LogStaRegion />
    <back-to-top transition-name="fade" />
  </div>
</template>

<script>
import BackToTop from '@/components/BackToTop'
import LogStaNumber from './components/LogStaNumber'
import LogStaDate from './components/LogStaDate'
import LogStaRegion from './components/LogStaRegion'

export default {
  name: 'LogSta',
  components: { BackToTop, LogStaDate, LogStaNumber, LogStaRegion },
  data() {
    return {}
  },
  computed: {},
  created() {}
}
</script>
