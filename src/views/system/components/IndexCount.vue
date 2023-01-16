<template>
  <el-row :gutter="10" style="padding: 15px 15px 0 15px;">
    <el-col v-for="(item, index) in datas" :key="index" :xs="24" :sm="3" style="margin-top:5px">
      <el-card :body-style="cardBodyStyle" style="text-align:center">
        <div slot="header">
          <span>{{ item.name }}</span>
        </div>
        <div>
          <el-statistic :value="item.count" />
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { count } from '@/api/system/index'

export default {
  name: 'SystemIndexCount',
  components: {},
  data() {
    return {
      name: '总数统计',
      loading: false,
      datas: [],
      cardBodyStyle: {
        padding: '10px 0px 10px 0px'
      }
    }
  },
  computed: {},
  created() {
    this.count()
  },
  mounted() { },
  methods: {
    count() {
      this.loading = true
      count().then(res => {
        this.datas = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
