<template>
  <Log type="2" />
</template>

<script>
import Log from './log'
export default {
  name: 'Action',
  components: { Log },
  data() {
    return { type: 2 }
  },
  created() {},
  methods: {}
}
</script>
