<template>
  <el-row v-loading="loading" :gutter="10">
    <el-col v-for="(item, index) in datas" :key="index" :xs="24" :sm="3">
      <el-card :body-style="{ padding: '10px 0px' }" class="text-center" shadow="never">
        <template #header>
          <span>{{ item.name }}</span>
        </template>
        <el-statistic :value="item.count" />
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { count } from '@/api/system/index'

export default {
  name: 'SystemIndexCount',
  data() {
    return {
      loading: false,
      datas: []
    }
  },
  computed: {
    name() {
      return this.$t('common.Count statistic')
    }
  },
  watch: {
    name() {
      this.count()
    }
  },
  created() {
    this.count()
  },
  methods: {
    count() {
      this.loading = true
      count()
        .then((res) => {
          this.datas = res.data.count
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
