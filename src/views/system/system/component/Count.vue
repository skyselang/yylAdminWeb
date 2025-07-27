<template>
  <el-row v-loading="loading" :gutter="10">
    <el-col v-for="(item, index) in data" :key="index" :xs="24" :sm="3">
      <el-card :body-style="{ padding: '10px 0px' }" class="text-center" shadow="never">
        <template #header>
          <el-text size="default">{{ item.name }}</el-text>
        </template>
        <el-statistic :value="item.count" />
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { countApi as api } from '@/api/system/index'

export default {
  data() {
    return {
      loading: false,
      data: []
    }
  },
  computed: {
    name() {
      return this.$t('总数统计')
    }
  },
  watch: {
    name() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      api()
        .then((res) => {
          this.data = res.data.count
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
