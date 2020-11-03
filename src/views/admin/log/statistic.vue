<template>
  <div>
    <StaNumber />
    <StaDate />
    <StaRegion />
    <back-to-top transition-name="fade" />
  </div>
</template>

<script>
import StaDate from './components/StaDate'
import StaNumber from './components/StaNumber'
import StaRegion from './components/StaRegion'
import BackToTop from '@/components/BackToTop'

export default {
  name: 'LogStatistic',
  components: { StaDate, StaNumber, StaRegion, BackToTop },
  data() {
    return {}
  },
  computed: {},
  created() {}
}
</script>
